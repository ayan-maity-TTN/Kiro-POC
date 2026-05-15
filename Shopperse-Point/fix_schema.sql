-- Drop all application tables in correct order (child tables first)
-- Run this in PostgreSQL against the 'postgres' database

DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS order_product CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_review CASCADE;
DROP TABLE IF EXISTS product_variation CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS category_metadata_field_values CASCADE;
DROP TABLE IF EXISTS category_metadata_field CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS user_role CASCADE;
DROP TABLE IF EXISTS blacklisted_token CASCADE;
DROP TABLE IF EXISTS reset_password_token CASCADE;
DROP TABLE IF EXISTS activation_token CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS seller CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;
DROP TABLE IF EXISTS role CASCADE;

-- Drop sequences if any
DROP SEQUENCE IF EXISTS users_seq CASCADE;
DROP SEQUENCE IF EXISTS app_user_seq CASCADE;
DROP SEQUENCE IF EXISTS hibernate_sequence CASCADE;
