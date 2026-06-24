-- Create course_videos table
CREATE TABLE IF NOT EXISTS course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on course_id for fast lookups
CREATE INDEX idx_course_videos_course_id ON course_videos(course_id);
CREATE INDEX idx_course_videos_order ON course_videos(course_id, "order");

-- Enable RLS
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view videos for courses they're enrolled in or created
CREATE POLICY "Users can view videos for enrolled courses"
  ON course_videos
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE creator_id = auth.uid()
      UNION
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- Creators can insert videos for their courses
CREATE POLICY "Creators can insert videos"
  ON course_videos
  FOR INSERT
  WITH CHECK (
    course_id IN (SELECT id FROM courses WHERE creator_id = auth.uid())
  );

-- Creators can update videos for their courses
CREATE POLICY "Creators can update videos"
  ON course_videos
  FOR UPDATE
  USING (
    course_id IN (SELECT id FROM courses WHERE creator_id = auth.uid())
  );

-- Creators can delete videos for their courses
CREATE POLICY "Creators can delete videos"
  ON course_videos
  FOR DELETE
  USING (
    course_id IN (SELECT id FROM courses WHERE creator_id = auth.uid())
  );

-- Trigger to update course video_count
CREATE OR REPLACE FUNCTION update_course_video_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses SET video_count = video_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses SET video_count = GREATEST(video_count - 1, 0) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_count
AFTER INSERT OR DELETE ON course_videos
FOR EACH ROW
EXECUTE FUNCTION update_course_video_count();
