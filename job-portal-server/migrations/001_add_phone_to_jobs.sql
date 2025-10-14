-- Migration: Add phone field to jobs table
-- Description: Adds contact phone number field for job postings
-- Date: 2025-10-14

-- Add phone column to jobs table
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add comment to the column for documentation
COMMENT ON COLUMN jobs.phone IS 'Contact phone number for the job posting (Russian format)';
