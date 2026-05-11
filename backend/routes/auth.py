from datetime import timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_password_hash,
    verify_password,
)
from crud import create_user, get_user_by_email
from database import get_session
from schemas import TokenResponse, UserCreate, UserRead, UserRegister

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegister, db: Session = Depends(get_session)):
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserCreate(
        id=str(uuid4()),
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        role="user",
        is_active=True,
    )

    db_user = await create_user(db, new_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session),
):
    user = await get_user_by_email(db, form_data.username)

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "uid": user.id, "role": user.role},
        expires_delta=access_token_expires,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserRead.model_validate(user),
    )
