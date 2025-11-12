--
-- Job Portal Database Init Script для Production
-- Версия для beget.app PostgreSQL
--

-- Настройки подключения
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- =============================================
-- 1. СОЗДАНИЕ ТИПОВ
-- =============================================

-- Тип для роли пользователя
CREATE TYPE user_role AS ENUM (
    'job_seeker',
    'employer'
);

-- =============================================
-- 2. СОЗДАНИЕ ФУНКЦИЙ
-- =============================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 3. СОЗДАНИЕ ТАБЛИЦ
-- =============================================

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    verification_code VARCHAR(10),
    verification_code_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вакансий
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT,
    min_price VARCHAR(50),
    max_price VARCHAR(50),
    salary_type VARCHAR(50),
    posting_date DATE,
    experience_level VARCHAR(100),
    employment_type VARCHAR(100),
    description TEXT,
    posted_by VARCHAR(255),
    skills TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    apartment VARCHAR(255) NOT NULL,
    user_id INTEGER,
    CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица откликов на вакансии
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    resume_link TEXT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id)
        REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT job_applications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 4. СОЗДАНИЕ ИНДЕКСОВ
-- =============================================

-- Индексы для таблицы users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Индексы для таблицы jobs
CREATE INDEX idx_job_title ON jobs(job_title);
CREATE INDEX idx_posted_by ON jobs(posted_by);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);

-- Индексы для таблицы job_applications
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_applications_user_id ON job_applications(user_id);

-- =============================================
-- 5. СОЗДАНИЕ ТРИГГЕРОВ
-- =============================================

-- Триггер для автоматического обновления updated_at в таблице users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ГОТОВО!
-- =============================================
-- База данных успешно инициализирована
-- Структура готова для работы Job Portal приложения
