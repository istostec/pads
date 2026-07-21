"""
Migration: Add image_url column to categories table.

This migration adds an image_url column to store category images
uploaded from the Admin Panel.
"""
from datetime import datetime
import os, sys

# Add repo root to path
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

from backend.extensions import db
from backend.app import create_app

app = create_app()

with app.app_context():
    from sqlalchemy import text
    try:
        db.session.execute(text(
            "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"
        ))
        db.session.commit()
        print("Migration 0004: Added image_url column to categories table.")
    except Exception as e:
        db.session.rollback()
        print(f"Migration 0004: Error adding image_url column: {e}")
