-- Migration 0005: Fix all SQLAlchemy model vs PostgreSQL schema mismatches
-- Run this directly against the 'pads' database:
-- psql -U postgres -d pads -f backend/database/migrations/0005_fix_schema_mismatches.sql

-- 1. Add amazon_link and flipkart_link to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_link VARCHAR(1000) DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS flipkart_link VARCHAR(1000) DEFAULT '';

-- 2. Ensure image_url exists on categories table (idempotent)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- 3. Add image_url to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000) DEFAULT '';

-- Verify the changes
SELECT 'Migration 0005 applied successfully' AS status;
