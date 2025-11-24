-- CareerVault Resume Builder - MySQL Setup Script
-- This script creates the database and sets up basic configuration

-- Create database
CREATE DATABASE IF NOT EXISTS `careervault`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `careervault`;

-- Create a dedicated user (optional)
-- CREATE USER 'careervault'@'localhost' IDENTIFIED BY 'careervault_password';
-- GRANT ALL PRIVILEGES ON careervault.* TO 'careervault'@'localhost';
-- FLUSH PRIVILEGES;

-- Show database info
SELECT 'Careervault database created successfully!' as message;
SELECT DATABASE() as current_database;
SHOW DATABASES LIKE 'careervault';
