"""Add role column to User model

Revision ID: bccdf68d6fe4
Revises: 
Create Date: 2025-02-17 17:10:05.236942

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bccdf68d6fe4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # 1. Add the 'role' column as nullable
    op.add_column('user',
        sa.Column('role', sa.String(length=20), nullable=True)
    )
    # 2. Update existing rows to have a default role (e.g., 'secretary')
    op.execute("UPDATE \"user\" SET role = 'secretary' WHERE role IS NULL")
    # 3. Alter the column to be non-nullable now that data exists for all rows
    op.alter_column('user', 'role', nullable=False)



def downgrade():
    op.drop_column('user', 'role')

