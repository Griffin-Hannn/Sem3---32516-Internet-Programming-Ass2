from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from auth import get_current_user
from models import User
from database import get_session
from crud import (
    create_expense,
    delete_expense,
    get_category,
    get_expense,
    get_expenses,
    update_expense,
)
from schemas import ExpenseCreate, ExpenseRead, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=List[ExpenseRead])
async def get_all_expenses(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Fetch all expense items, with optional category filtering."""
    return await get_expenses(
        db,
        user_id=current_user.id,
        category=category,
        skip=skip,
        limit=limit,
    )


@router.post("", response_model=ExpenseRead)
async def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new expense item."""
    if expense.category_id:
        category = await get_category(db, expense.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        if category.user_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Not allowed to use this category")

    db_expense = await create_expense(db, expense, current_user.id)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.put("/{expense_id}", response_model=ExpenseRead)
async def edit_expense(
    expense_id: str,
    updated_expense: ExpenseUpdate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update an expense item."""
    existing_expense = await get_expense(db, expense_id)
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")
    if (
        existing_expense.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(status_code=403, detail="Not allowed to modify this expense")

    if updated_expense.category_id:
        category = await get_category(db, updated_expense.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        if category.user_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Not allowed to use this category")

    db_expense = await update_expense(db, expense_id, updated_expense)

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")

    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/{expense_id}")
async def remove_expense(
    expense_id: str,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Delete an expense item."""
    existing_expense = await get_expense(db, expense_id)
    if not existing_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")
    if (
        existing_expense.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(status_code=403, detail="Not allowed to delete this expense")

    db_expense = await delete_expense(db, expense_id)

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
