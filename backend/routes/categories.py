from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from auth import get_current_user
from crud import (
    create_category,
    delete_category,
    get_categories_by_user,
    get_category,
    has_expenses_for_category,
    sync_expense_category_name,
    update_category,
)
from database import get_session
from models import User
from schemas import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryRead])
async def get_all_categories(
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return await get_categories_by_user(db, current_user.id, skip=skip, limit=limit)


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def add_category(
    category: CategoryCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_category = await create_category(db, category, current_user.id)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.put("/{category_id}", response_model=CategoryRead)
async def edit_category(
    category_id: str,
    updated_category: CategoryUpdate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    existing_category = await get_category(db, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if existing_category.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed to modify this category")

    old_name = existing_category.name
    db_category = await update_category(db, category_id, updated_category)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if updated_category.name and updated_category.name != old_name:
        await sync_expense_category_name(
            db,
            category_id=category_id,
            category_name=updated_category.name,
            user_id=existing_category.user_id,
        )

    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/{category_id}")
async def remove_category(
    category_id: str,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    existing_category = await get_category(db, category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if existing_category.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed to delete this category")

    used_by_expenses = await has_expenses_for_category(
        db,
        category_id=category_id,
        user_id=existing_category.user_id,
    )
    if used_by_expenses:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category because existing expenses still use it",
        )

    deleted = await delete_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
