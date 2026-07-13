# 404 Project

A full-stack 2-in-1 web app combining **task management** (Kanban board) and **image annotation** (polygon drawing).

## Repositories

| | Link |
|---|------|
| Combined repo (GitHub) | https://github.com/cadmostafijur/404 |
| Live Frontend | https://404-ivory.vercel.app/login |
| Live Backend API | https://four04-pn5s.onrender.com|

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `demo@404project.com` |
| Password | `demo1234` |

## Quick Start

### One-time setup

```bash
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1    # Windows (use source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_user
cd ..

# Install all Node dependencies
npm run install:all
```

### Run everything (frontend + backend)

From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Features

### Task Management (`/tasks`)
- Kanban board with To Do, In Progress, Done columns
- Date picker to filter tasks by day
- Drag-and-drop between columns
- Add/edit/delete tasks with modals
- Tasks have title, priority, due date, and tags
- All data persisted via Django REST API

### Image Annotation (`/annotate`)
- Upload multiple images
- Scroll through all uploaded images
- Draw polygons on images
- Remove individual polygons
- Annotations saved to database

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Zustand, @dnd-kit |
| Backend | Django 6, DRF, JWT, SQLite, Pillow |
| Versions | Node 22.12.0, Python 3.12.6 |

## Deployment Checklist

- [ ] Push to GitHub (this repo already contains both `frontend/` and `backend/`)
- [ ] Deploy `frontend/` on Vercel — set **Root Directory** to `frontend`
- [ ] Deploy `backend/` on Render — set **Root Directory** to `backend`
- [ ] Set `NEXT_PUBLIC_API_URL` on Vercel to the deployed backend URL
- [ ] Set `CORS_ALLOWED_ORIGINS` and `DJANGO_ALLOWED_HOSTS` on the backend to the Vercel frontend URL/host
- [ ] Run `python manage.py create_demo_user` on the backend host after first deploy
- [ ] Record a ≤2 min demo video

See individual README files in `frontend/` and `backend/` for detailed setup, deployment steps, and villain-slaying stories.
