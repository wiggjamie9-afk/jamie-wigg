-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create index on user_id and course_id for fast lookups
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_enrolled_at ON enrollments(enrolled_at DESC);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view their enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only the system can insert enrollments (via API)
CREATE POLICY "Service role can insert enrollments"
  ON enrollments
  FOR INSERT
  WITH CHECK (true);

-- Users can delete their own enrollments
CREATE POLICY "Users can delete their enrollments"
  ON enrollments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update course enrolled_count
CREATE OR REPLACE FUNCTION update_course_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses SET enrolled_count = enrolled_count + 1 WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses SET enrolled_count = GREATEST(enrolled_count - 1, 0) WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrolled_count
AFTER INSERT OR DELETE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_course_enrolled_count();
