from datetime import date as DateValue
from typing import Optional

from sqlmodel import SQLModel


class UserCreate(SQLModel):
    id: str
    email: str
    name: str
    hashed_password: str
    role: str = "user"
    is_active: bool = True


class UserRead(SQLModel):
    id: str
    email: str
    name: str
    role: str
    is_active: bool


class UserUpdate(SQLModel):
    email: Optional[str] = None
    name: Optional[str] = None
    hashed_password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserAdminUpdate(SQLModel):
    email: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserRegister(SQLModel):
    email: str
    name: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str
    user: UserRead


class CategoryCreate(SQLModel):
    id: str
    name: str


class CategoryRead(SQLModel):
    id: str
    name: str
    user_id: str


class CategoryUpdate(SQLModel):
    name: Optional[str] = None


class ExpenseCreate(SQLModel):
    id: str
    title: str
    category: str
    amount: float
    date: DateValue
    description: Optional[str] = None
    category_id: Optional[str] = None


class ExpenseRead(SQLModel):
    id: str
    title: str
    category: str
    amount: float
    date: DateValue
    description: Optional[str] = None
    user_id: Optional[str] = None
    category_id: Optional[str] = None


class ExpenseUpdate(SQLModel):
    title: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[DateValue] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
