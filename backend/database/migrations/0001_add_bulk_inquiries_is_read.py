from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_add_bulk_inquiries_is_read'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'bulk_inquiries',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('mobile_number', sa.String(length=50), nullable=False),
        sa.Column('email_address', sa.String(length=255), nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('pincode', sa.String(length=20), nullable=False),
        sa.Column('product_name', sa.String(length=255), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='New Inquiry', nullable=True),
        sa.Column('is_read', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )

    op.create_index('idx_bulk_inquiries_created_at', 'bulk_inquiries', ['created_at'])


def downgrade():
    op.drop_index('idx_bulk_inquiries_created_at', table_name='bulk_inquiries')
    op.drop_table('bulk_inquiries')

