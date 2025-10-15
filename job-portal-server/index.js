const express = require('express')
const app = express()
const cors = require('cors')
const { Pool } = require('pg')
const port = process.env.PORT || 5000;
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (например, мобильные приложения или curl)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://217.26.25.78",
      "http://rabota.elistory.ru",
      "https://rabota.elistory.ru"
    ];

    // Если CORS_ORIGIN = *, разрешаем все
    if (process.env.CORS_ORIGIN === "*") {
      return callback(null, true);
    }

    // Проверяем, разрешен ли origin
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["POST", "GET", "PATCH", "DELETE"],
  credentials: true
}));
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:3000", "https://mern-job-portal-website.vercel.app"],
//   methods: ["POST", "GET", "PATCH", "DELETE"],
//   credentials: true
// }));

// Helper function to convert snake_case to camelCase
function toCamelCase(obj) {
  const camelCaseObj = {};
  for (let key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    camelCaseObj[camelKey] = obj[key];
  }
  // Add _id for compatibility with frontend
  camelCaseObj._id = obj.id;
  return camelCaseObj;
}

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database at:', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('Hello Developer! Job Portal API is running with PostgreSQL')
})

// Posting a Job
app.post("/post-job", async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      companyLogo,
      minPrice,
      maxPrice,
      salaryType,
      jobLocation,
      postingDate,
      experienceLevel,
      employmentType,
      description,
      postedBy,
      skills
    } = req.body;

    // Convert skills from react-select format to array of strings
    let skillsArray = [];
    if (Array.isArray(skills)) {
      skillsArray = skills.map(skill => typeof skill === 'object' ? skill.value : skill);
    } else if (skills) {
      skillsArray = [skills];
    }

    const query = `
      INSERT INTO jobs (
        job_title, company_name, company_logo, min_price, max_price,
        salary_type, job_location, posting_date, experience_level,
        employment_type, description, posted_by, skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      jobTitle, companyName, companyLogo, minPrice, maxPrice,
      salaryType, jobLocation, postingDate, experienceLevel,
      employmentType, description, postedBy, skillsArray
    ];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return res.status(200).json({
        message: "Job posted successfully",
        job: result.rows[0]
      });
    } else {
      return res.status(404).json({
        message: "Failed to post job! Try again later",
        status: false
      });
    }
  } catch (error) {
    console.error('Error posting job:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Get all jobs
app.get("/all-jobs", async (req, res) => {
  try {
    const query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    const result = await pool.query(query);
    const camelCaseJobs = result.rows.map(job => toCamelCase(job));
    res.json(camelCaseJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      message: "Error fetching jobs",
      error: error.message
    });
  }
});

// Get Single job using ID
app.get("/all-jobs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      res.json(toCamelCase(result.rows[0]));
    } else {
      res.status(404).json({
        message: "Job not found"
      });
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      message: "Error fetching job",
      error: error.message
    });
  }
});

// Get Jobs by email
app.get("/myJobs/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = 'SELECT * FROM jobs WHERE posted_by = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [email]);
    const camelCaseJobs = result.rows.map(job => toCamelCase(job));
    res.json(camelCaseJobs);
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    res.status(500).json({
      message: "Error fetching jobs",
      error: error.message
    });
  }
});

// Delete a Job
app.delete("/job/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      res.json({
        message: "Job deleted successfully",
        deletedJob: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: "Job not found"
      });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      message: "Error deleting job",
      error: error.message
    });
  }
});

// Update a Job
app.patch("/update-job/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {
      jobTitle,
      companyName,
      companyLogo,
      minPrice,
      maxPrice,
      salaryType,
      jobLocation,
      postingDate,
      experienceLevel,
      employmentType,
      description,
      postedBy,
      skills
    } = req.body;

    // Convert skills from react-select format to array of strings
    let skillsArray = null;
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills.map(skill => typeof skill === 'object' ? skill.value : skill);
      } else {
        skillsArray = [skills];
      }
    }

    const query = `
      UPDATE jobs
      SET job_title = COALESCE($1, job_title),
          company_name = COALESCE($2, company_name),
          company_logo = COALESCE($3, company_logo),
          min_price = COALESCE($4, min_price),
          max_price = COALESCE($5, max_price),
          salary_type = COALESCE($6, salary_type),
          job_location = COALESCE($7, job_location),
          posting_date = COALESCE($8, posting_date),
          experience_level = COALESCE($9, experience_level),
          employment_type = COALESCE($10, employment_type),
          description = COALESCE($11, description),
          posted_by = COALESCE($12, posted_by),
          skills = COALESCE($13, skills)
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      jobTitle, companyName, companyLogo, minPrice, maxPrice,
      salaryType, jobLocation, postingDate, experienceLevel,
      employmentType, description, postedBy, skillsArray, id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.json({
        message: "Job updated successfully",
        job: result.rows[0]
      });
    } else {
      res.status(404).json({
        message: "Job not found"
      });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      message: "Error updating job",
      error: error.message
    });
  }
});

// Resume Submission - Job Application
app.post('/job/:id/apply', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { resumeLink } = req.body;

    // First check if job exists
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const query = `
      INSERT INTO job_applications (job_id, resume_link)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await pool.query(query, [jobId, resumeLink]);

    res.json({
      message: 'Application submitted successfully!',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
});

// Get applications for a specific job
app.get('/job/:id/applications', async (req, res) => {
  try {
    const jobId = req.params.id;
    const query = `
      SELECT * FROM job_applications
      WHERE job_id = $1
      ORDER BY applied_at DESC
    `;
    const result = await pool.query(query, [jobId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing PostgreSQL connection pool...');
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Job Portal API listening on port ${port}`)
})
