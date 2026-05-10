from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=50)
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    hashed_password: str = Field(max_length=255)
    role: str = Field(default="user", max_length=20)
    is_active: bool = Field(default=True)


class Category(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=50)
    name: str = Field(max_length=100)
    user_id: str = Field(foreign_key="user.id", index=True, max_length=50)


class Expense(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=50)
    title: str = Field(max_length=100)
    category: str = Field(max_length=50)
    amount: float
    date: date
    description: Optional[str] = Field(default=None, max_length=255)
    user_id: Optional[str] = Field(default=None, foreign_key="user.id", index=True, max_length=50)
    category_id: Optional[str] = Field(default=None, foreign_key="category.id", index=True, max_length=50)
