from typing import List, Optional

from sqlmodel import Session, select

from models import Category
from schemas import CategoryCreate, CategoryUpdate


async def create_category(session: Session, category_create: CategoryCreate) -> Category:
    new_category = Category.model_validate(category_create)
    session.add(new_category)
    return new_category


async def get_category(session: Session, category_id: str) -> Optional[Category]:
    return session.get(Category, category_id)


async def get_categories_by_user(
    session: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 30,
) -> List[Category]:
    statement = (
        select(Category)
        .where(Category.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return session.exec(statement).all()


async def update_category(
    session: Session,
    category_id: str,
    category_update: CategoryUpdate,
) -> Optional[Category]:
    category = await get_category(session, category_id)

    if not category:
        return None

    update_data = category_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(category, key, value)

    session.add(category)
    return category


async def delete_category(session: Session, category_id: str) -> bool:
    category = await get_category(session, category_id)

    if not category:
        return False

    session.delete(category)
    return True
