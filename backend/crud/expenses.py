from typing import List, Optional

from sqlmodel import Session, select

from models import Expense
from schemas import ExpenseCreate, ExpenseUpdate


async def create_expense(
    session: Session,
    expense_create: ExpenseCreate,
    user_id: str,
) -> Expense:
    new_expense = Expense.model_validate(
        {
            **expense_create.model_dump(),
            "user_id": user_id,
        }
    )
    session.add(new_expense)
    return new_expense


async def get_expense(session: Session, expense_id: str) -> Optional[Expense]:
    return session.get(Expense, expense_id)


async def get_expenses(
    session: Session,
    user_id: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 30,
) -> List[Expense]:
    statement = select(Expense)

    if user_id:
        statement = statement.where(Expense.user_id == user_id)

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


async def has_expenses_for_category(
    session: Session,
    category_id: str,
    user_id: Optional[str] = None,
) -> bool:
    statement = select(Expense).where(Expense.category_id == category_id)
    if user_id:
        statement = statement.where(Expense.user_id == user_id)

    expense = session.exec(statement).first()
    return expense is not None


async def sync_expense_category_name(
    session: Session,
    category_id: str,
    category_name: str,
    user_id: Optional[str] = None,
) -> int:
    statement = select(Expense).where(Expense.category_id == category_id)
    if user_id:
        statement = statement.where(Expense.user_id == user_id)

    expenses = session.exec(statement).all()

    for expense in expenses:
        expense.category = category_name
        session.add(expense)

    return len(expenses)
