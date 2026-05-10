from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from database import get_session
from crud import create_expense, get_expenses, update_expense, delete_expense
from schemas import ExpenseCreate, ExpenseRead, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=List[ExpenseRead])
async def get_all_expenses(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 30,
    db: Session = Depends(get_session),
):
    """Fetch all expense items, with optional category filtering."""
    return await get_expenses(db, category=category, skip=skip, limit=limit)


@router.post("", response_model=ExpenseRead)
async def add_expense(expense: ExpenseCreate, db: Session = Depends(get_session)):
    """Create a new expense item."""
    db_expense = await create_expense(db, expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.put("/{expense_id}", response_model=ExpenseRead)
async def edit_expense(
    expense_id: str,
    updated_expense: ExpenseUpdate,
    db: Session = Depends(get_session),
):
    """Update an expense item."""
    db_expense = await update_expense(db, expense_id, updated_expense)

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")

    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/{expense_id}")
async def remove_expense(expense_id: str, db: Session = Depends(get_session)):
    """Delete an expense item."""
    db_expense = await delete_expense(db, expense_id)

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense item not found")

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
