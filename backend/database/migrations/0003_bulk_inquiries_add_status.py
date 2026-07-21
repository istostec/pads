"""Add status column to bulk_inquiries.

Fixes runtime errors like:
    sqlalchemy.exc.ProgrammingError: column bulk_inquiries.status does not exist

This migration is intentionally idempotent: it checks for the column before adding it.
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0003_bulk_inquiries_add_status'
down_revision = '0001_add_bulk_inquiries_is_read'
branch_labels = None
depends_on = None


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    res = conn.execute(
        sa.text(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = :table_name
              AND column_name = :column_name
            """
        ),
        {"table_name": table_name, "column_name": column_name},
    ).first()
    return res is not None


def upgrade():
    conn = op.get_bind()

    if not _column_exists(conn, 'bulk_inquiries', 'status'):
        # Safe default for existing rows
        op.add_column(
            'bulk_inquiries',
            sa.Column(
                'status',
                sa.String(length=50),
                nullable=True,
                server_default='New Inquiry',
            ),
        )

        # Ensure existing rows immediately receive the default value.
        # (server_default should backfill for the column upon add, but we also do it explicitly)
        conn.execute(
            sa.text(
                """
                UPDATE bulk_inquiries
                SET status = 'New Inquiry'
                WHERE status IS NULL;
                """
            )
        )

        # Keep it nullable, but remove the default for future inserts to match the model,
        # while still ensuring new rows created by SQLAlchemy will provide a value.
        # If you'd rather keep the DB default permanently, remove the next op.alter_column call.
        op.alter_column(
            'bulk_inquiries',
            'status',
            server_default=sa.text("NULL"),
        )


def downgrade():
    conn = op.get_bind()

    if _column_exists(conn, 'bulk_inquiries', 'status'):
        # Dropping the column is destructive; only do it if present.
        op.drop_column('bulk_inquiries', 'status')

