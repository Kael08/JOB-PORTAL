-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT,
    min_price VARCHAR(50),
    max_price VARCHAR(50),
    salary_type VARCHAR(50),
    job_location VARCHAR(255),
    posting_date DATE,
    experience_level VARCHAR(100),
    employment_type VARCHAR(100),
    description TEXT,
    posted_by VARCHAR(255),
    skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on posted_by for faster queries
CREATE INDEX IF NOT EXISTS idx_posted_by ON jobs(posted_by);

-- Create index on job_title for faster searches
CREATE INDEX IF NOT EXISTS idx_job_title ON jobs(job_title);

-- Create job_applications table for resume submissions
CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_link TEXT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on job_id for faster queries
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
