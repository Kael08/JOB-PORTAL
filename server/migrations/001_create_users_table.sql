-- Создание таблицы пользователей
-- Выполните этот скрипт в вашей PostgreSQL базе данных

-- Создание типа для роли пользователя
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer');

-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  verification_code VARCHAR(10),
  verification_code_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации поиска
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных (опционально, можно удалить)
-- INSERT INTO users (phone, name, role) VALUES
--   ('+79991234567', 'Тестовый работодатель', 'employer'),
--   ('+79997654321', 'Тестовый соискатель', 'job_seeker');
