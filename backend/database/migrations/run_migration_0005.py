"""
Standalone runner for Migration 0005.
Connects directly to PostgreSQL using psycopg2 and runs ALTER TABLE statements.
Usage: python backend/database/migrations/run_migration_0005.py
"""
import os
import sys
from urllib.parse import urlparse

# The application uses: postgresql://postgres:jay3234@localhost:5432/pads
DATABASE_URL = 'postgresql://postgres:jay3234@localhost:5432/pads'

import psycopg2

# Parse the DATABASE URL
parsed = urlparse(DATABASE_URL)
conn = psycopg2.connect(
    host=parsed.hostname or 'localhost',
    port=parsed.port or 5432,
    database=parsed.path.lstrip('/') if parsed.path else 'pads',
    user=parsed.username or 'postgres',
    password=parsed.password or 'postgres'
)
conn.autocommit = True
cur = conn.cursor()

statements = [
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_link VARCHAR(1000) DEFAULT ''",
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS flipkart_link VARCHAR(1000) DEFAULT ''",
    "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)",
    "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000) DEFAULT ''",
]

for sql in statements:
    try:
        cur.execute(sql)
        print(f"OK: {sql.split('ADD COLUMN')[1].strip()}")
    except Exception as e:
        print(f"ERROR: {e}")

cur.close()
conn.close()
print("Migration 0005 complete.")
