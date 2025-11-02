-- Add user_id to jobs table
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

-- Add user_id to job_applications table
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON job_applications(user_id);

-- Migrate existing data: update jobs with user_id based on posted_by phone
-- This assumes posted_by now contains phone numbers, not emails
UPDATE jobs j
SET user_id = u.id
FROM users u
WHERE j.posted_by = u.phone
AND j.user_id IS NULL;
