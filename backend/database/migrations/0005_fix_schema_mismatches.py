"""
Migration 0005: Fix all SQLAlchemy model vs PostgreSQL schema mismatches.

Detected mismatches:
1. products table: missing amazon_link (VARCHAR(1000)) and flipkart_link (VARCHAR(1000))
2. categories table: may be missing image_url (VARCHAR(500)) if DB was created before migration 0004
3. reviews table: missing image_url (VARCHAR(1000))

These mismatches cause HTTP 500 errors because SQLAlchemy tries to SELECT columns
that don't exist in the PostgreSQL database.
"""
import os
import sys

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from backend.extensions import db
from backend.app import create_app

app = create_app()

with app.app_context():
    from sqlalchemy import text
    try:
        # 1. Add amazon_link and flipkart_link to products table
        db.session.execute(text(
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_link VARCHAR(1000) DEFAULT ''"
        ))
        db.session.execute(text(
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS flipkart_link VARCHAR(1000) DEFAULT ''"
        ))
        print("Migration 0005: Added amazon_link and flipkart_link to products table.")

        # 2. Ensure image_url exists on categories table (idempotent)
        db.session.execute(text(
            "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"
        ))
        print("Migration 0005: Ensured image_url exists on categories table.")

        # 3. Add image_url to reviews table
        db.session.execute(text(
            "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000) DEFAULT ''"
        ))
        print("Migration 0005: Added image_url to reviews table.")

        db.session.commit()
        print("Migration 0005: All schema fixes applied successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration 0005: Error applying fixes: {e}")
