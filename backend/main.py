from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from database import engine
from routes import auth_router, categories_router, expenses_router, users_router

SQLModel.metadata.create_all(engine)

app = FastAPI(title="Expense Tracker API")

origins = [
    "http://localhost:3000", # React
    "http://127.0.0.1:3000",
    "http://localhost:5173", # Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # not used but kept as a common and harmless development configuration
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(expenses_router)
app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(users_router)
