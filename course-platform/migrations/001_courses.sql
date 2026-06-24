-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 9900,
  video_count INTEGER NOT NULL DEFAULT 0,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on creator_id for fast lookups
CREATE INDEX idx_courses_creator_id ON courses(creator_id);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view published courses
CREATE POLICY "Anyone can view courses"
  ON courses
  FOR SELECT
  USING (true);

-- Creators can insert their own courses
CREATE POLICY "Creators can insert courses"
  ON courses
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own courses
CREATE POLICY "Creators can update their courses"
  ON courses
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Creators can delete their own courses
CREATE POLICY "Creators can delete their courses"
  ON courses
  FOR DELETE
  USING (auth.uid() = creator_id);
