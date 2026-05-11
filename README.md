# Expense Tracker (Assignment 2)

## Project Title
Expense Tracker - UTS 32516 Internet Programming (Assignment 2)

## Project Description
This project is a full-stack expense tracking web app built with a React frontend and FastAPI backend.
It supports authentication, role-based access control, and per-user expense/category management.

## Problem Solved
The app helps users manage personal spending in one place with:
- secure login
- category-based expense tracking
- quick searching/filtering
- simple summaries and dashboard views

## Main Features
- User registration and JWT login
- Protected routes in frontend and backend
- Role-aware navigation (admin link only for admins)
- Expense CRUD (create/read/update/delete)
- Live expense search (title/description/category)
- Category CRUD
- Category rename consistency with existing expenses
- Category deletion blocked when expenses still reference it
- Dashboard summary (total spending, category totals, recent expenses)
- Profile page
- Admin user management (list users, update role/status, deactivate)

## Tech Stack
### Frontend
- React
- React Router DOM
- Fetch API
- CSS

### Backend
- FastAPI
- SQLModel
- SQLAlchemy
- Passlib (bcrypt)
- PyJWT

### Database
- PostgreSQL

## How To Run
## 1. Clone repository
```bash
git clone <your-public-assignment2-repo-url>
cd "Ass2"
```

## 2. Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `backend/.env` values.

Run backend:
```bash
uvicorn main:app --reload
```

Backend URL:
- `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

## 3. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend URL:
- `http://127.0.0.1:5173`

Build check:
```bash
npm run build
```

## Environment Variables
## Backend (`backend/.env`)
- `DATABASE_URL=postgresql+psycopg2://<db_user>:<db_password>@localhost:5432/<db_name>`
- `SECRET_KEY=<long_random_secret_key>`

## Frontend (`frontend/.env`)
- `VITE_API_URL=http://127.0.0.1:8000`

## Database Setup
Option A (recommended for current Assignment 2 schema):
1. Create an empty PostgreSQL database.
2. Set `DATABASE_URL` in backend `.env`.
3. Start backend once (`uvicorn main:app --reload`).
4. SQLModel creates required tables (`user`, `category`, `expense`) automatically.

Option B (legacy export file):
- `database/export.sql` is included as required repository artifact.
- It reflects the earlier Assignment 1 export format and may need regeneration after final Assignment 2 data setup.

## Suggested Database Export Command (before submission)
```bash
pg_dump -U <db_user> -d <db_name> -f database/export.sql
```

## Folder Structure
```text
Ass2/
├── backend/
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud/
│   └── routes/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   └── package.json
├── database/
│   └── export.sql
├── WORKLOAD.md
└── docs/
    └── demo_script.md
```

## Test Accounts
Create accounts via `/register` or Swagger `POST /auth/register`.
For admin testing, set one account's role to `admin` through DB or existing admin endpoint flow.

## Known Limitations
- No password reset flow.
- Profile update UI is read-only currently.
- No pagination controls in frontend lists yet.
- `database/export.sql` should be re-exported near final submission to match latest schema/data.

## Submission Notes
- Public GitHub repository required.
- Include source code, README, workload file, and database export.
- Include a video demonstration of up to 3 minutes.
