from typing import List, Optional

from sqlmodel import Session, select

from models import Category, Expense, User
from schemas import UserAdminUpdate, UserCreate, UserUpdate


async def create_user(session: Session, user_create: UserCreate) -> User:
    new_user = User.model_validate(user_create)
    session.add(new_user)
    return new_user


async def get_user(session: Session, user_id: str) -> Optional[User]:
    return session.get(User, user_id)


async def get_user_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


async def get_users(session: Session, skip: int = 0, limit: int = 30) -> List[User]:
    statement = select(User).offset(skip).limit(limit)
    return session.exec(statement).all()


async def update_user(
    session: Session,
    user_id: str,
    user_update: UserUpdate | UserAdminUpdate,
) -> Optional[User]:
    user = await get_user(session, user_id)

    if not user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    session.add(user)
    return user


async def delete_user(session: Session, user_id: str) -> bool:
    user = await get_user(session, user_id)

    if not user:
        return False

    session.delete(user)
    return True


async def get_user_related_data_counts(session: Session, user_id: str) -> dict[str, int]:
    category_count = len(
        session.exec(select(Category.id).where(Category.user_id == user_id)).all()
    )
    expense_count = len(
        session.exec(select(Expense.id).where(Expense.user_id == user_id)).all()
    )
    return {"categories": category_count, "expenses": expense_count}
