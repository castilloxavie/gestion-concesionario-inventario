"""add_is_seed_to_user

Revision ID: seed001
Revises: dcca1b1716a0
Create Date: 2026-02-25 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'seed001'
down_revision: Union[str, Sequence[str], None] = 'dcca1b1716a0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # MySQL necesita server_default como 0 para boolean, no 'false'
    op.add_column('users', sa.Column('is_seed', sa.Boolean(), nullable=False, server_default=sa.text('0')))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'is_seed')
