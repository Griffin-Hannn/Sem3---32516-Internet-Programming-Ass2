from typing import List, Optional

from sqlmodel import Session, select

from models import Expense
from schemas import ExpenseCreate, ExpenseUpdate


async def create_expense(session: Session, expense_create: ExpenseCreate) -> Expense:
    new_expense = Expense.model_validate(expense_create)
    session.add(new_expense)
    return new_expense


async def get_expense(session: Session, expense_id: str) -> Optional[Expense]:
    return session.get(Expense, expense_id)


async def get_expenses(
    session: Session,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 30,
) -> List[Expense]:
    statement = select(Expense)

    if category:
        statement = statement.where(Expense.category == category)

    statement = statement.order_by(Expense.date.desc()).offset(skip).limit(limit)

    return session.exec(statement).all()


async def update_expense(
    session: Session,
    expense_id: str,
    expense_update: ExpenseUpdate,
) -> Optional[Expense]:
    expense = await get_expense(session, expense_id)

    if not expense:
        return None

    update_data = expense_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(expense, key, value)

    session.add(expense)
    return expense


async def delete_expense(session: Session, expense_id: str) -> bool:
    expense = await get_expense(session, expense_id)

    if not expense:
        return False

    session.delete(expense)
    return True
