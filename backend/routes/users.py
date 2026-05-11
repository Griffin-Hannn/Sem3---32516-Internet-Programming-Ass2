from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from auth import get_current_admin_user
from crud import get_user, get_users, update_user
from database import get_session
from models import User
from schemas import UserAdminUpdate, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[UserRead])
async def list_users(
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_session),
    _: User = Depends(get_current_admin_user),
):
    return await get_users(db, skip=skip, limit=limit)


@router.put("/{user_id}", response_model=UserRead)
async def admin_update_user(
    user_id: str,
    user_update: UserAdminUpdate,
    db: Session = Depends(get_session),
    current_admin: User = Depends(get_current_admin_user),
):
    existing_user = await get_user(db, user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    if existing_user.id == current_admin.id and user_update.is_active is False:
        raise HTTPException(status_code=400, detail="Admin cannot deactivate their own account")

    updated = await update_user(db, user_id, user_update)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")

    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/{user_id}", response_model=UserRead)
async def admin_deactivate_user(
    user_id: str,
    db: Session = Depends(get_session),
    current_admin: User = Depends(get_current_admin_user),
):
    existing_user = await get_user(db, user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    if existing_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Admin cannot deactivate their own account")

    updated = await update_user(db, user_id, UserAdminUpdate(is_active=False))
    db.commit()
    db.refresh(updated)
    return updated
