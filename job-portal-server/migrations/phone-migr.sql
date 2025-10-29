-- Add phone column if not exists
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Update existing jobs with sample phone numbers
UPDATE jobs SET phone = '+7 (495) 123-45-67' WHERE phone IS NULL;