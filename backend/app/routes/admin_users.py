"""Administrator routes for managing user accounts."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models import User, UserRole
from app.schemas import (
    AdminCreateUserRequest,
    AdminUpdateUserRoleRequest,
    AdminUpdateUserRequest,
    AdminUserResponse,
    MessageResponse,
)
from app.services.admin_user_service import (
    create_user,
    delete_user,
    update_user,
    update_user_role,
    get_all_users,
)

router = APIRouter(prefix="/admin/users", tags=["Admin User Management"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Allow access only to authenticated administrators."""
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access is required.",
        )
    return current_user


@router.get(
    "",
    response_model=List[AdminUserResponse],
    summary="Get all users",
    description="Returns all registered users.",
)
def get_admin_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Return all registered users."""
    return get_all_users(db)


@router.post(
    "",
    response_model=AdminUserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a user",
    description="Creates a user with an administrator-selected role and account status.",
)
def create_admin_user(
    user_data: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> User:
    """Create a user account after validating its email and preferred language."""
    return create_user(db, user_data)


@router.put(
    "/{user_id}",
    response_model=AdminUserResponse,
    summary="Update a user's role or status",
    description="Updates only role and status. Username and email cannot be changed through this endpoint.",
)
def update_admin_user(
    user_id: int,
    user_data: AdminUpdateUserRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> User:
    """Update the permitted administrative fields for a user."""
    return update_user(db, user_id, user_data)


@router.patch(
    "/{user_id}/role",
    response_model=AdminUserResponse,
    summary="Update a user's role",
    description="Updates only the role for an existing user.",
)
def update_admin_user_role(
    user_id: int,
    user_data: AdminUpdateUserRoleRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> User:
    """Update only the role for a user."""
    return update_user_role(db, user_id, user_data.role)


@router.delete(
    "/{user_id}",
    response_model=MessageResponse,
    summary="Delete a user",
    description="Permanently removes a user account when it exists.",
)
def delete_admin_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> MessageResponse:
    """Delete a user account and return a confirmation message."""
    delete_user(db, user_id)
    return MessageResponse(message="User deleted successfully")
