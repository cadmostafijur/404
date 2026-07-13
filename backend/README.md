# 404 Project — Backend

Django REST API powering the 404 Project task management and image annotation app.

## Tech Stack

- **Python** 3.12+
- **Django** 6.x
- **Django REST Framework** with JWT authentication
- **SQLite** (default) — swap for PostgreSQL in production
- **Pillow** for image handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login with email & password |
| POST | `/api/auth/register/` | Register new user |
| GET | `/api/auth/me/` | Get current user |
| GET/POST | `/api/tasks/` | List/create tasks (`?task_date=YYYY-MM-DD`) |
| GET/PATCH/DELETE | `/api/tasks/<id>/` | Task detail |
| POST | `/api/tasks/reorder/` | Reorder tasks after drag-and-drop |
| GET/POST | `/api/annotations/images/` | List/upload images |
| DELETE | `/api/annotations/images/<id>/` | Delete image |
| GET/POST | `/api/annotations/polygons/` | List/create polygons |
| DELETE | `/api/annotations/polygons/<id>/` | Delete polygon |

## Demo User

| Field | Value |
|-------|-------|
| Email | `demo@404project.com` |
| Password | `demo1234` |

## Setup & Run

### Prerequisites

- Python 3.12+
- pip

### Steps

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_user
python manage.py runserver
```

The API runs at **http://localhost:8000**.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DJANGO_SECRET_KEY` | dev key | Secret key for production |
| `DJANGO_DEBUG` | `True` | Debug mode |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated hosts |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Frontend origins |

## Deployment (Render)

This repo is a monorepo (`frontend/` + `backend/`), so point Render at the
`backend` subdirectory.

1. Push to GitHub, then in [Render](https://render.com) create a **New Web
   Service** from this repo.
2. Set **Root Directory** to `backend`.
3. **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py create_demo_user`
4. **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Set environment variables (Render dashboard → Environment):
   - `DJANGO_SECRET_KEY` — generate a fresh one, don't reuse the dev key
   - `DJANGO_DEBUG` = `False`
   - `DJANGO_ALLOWED_HOSTS` = `your-service.onrender.com`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
6. `create_demo_user` runs as part of the Build Command above (idempotent —
   safe on every deploy) since **free-tier Render instances don't have
   Shell access** to run one-off management commands manually.
7. Static files are served by WhiteNoise (already wired into
   `MIDDLEWARE`/`STORAGES` in `config/settings.py`) — no separate static
   host needed.

**Persistence caveat:** Render's free web service disk is ephemeral — it's
wiped on every redeploy (not on idle spin-down, only on new deploys). Since
this app uses SQLite and stores uploaded annotation images on local disk,
a redeploy after your first setup will reset the database and delete
uploaded images. For a one-time demo/submission this is usually fine (redeploy
once, seed the demo user, then avoid redeploying); for real persistence,
add a Render persistent disk or switch to hosted Postgres + object storage.

## Villains Faced & How We Won

**Villain 1: JWT + CORS handshake** — The frontend and backend run on different ports, so cookies alone won't cut it. We brought in `djangorestframework-simplejwt` for token auth and `django-cors-headers` with explicit allowed origins. Friendship power: the DRF authentication docs.

**Villain 2: Polygon coordinate scaling** — Click coordinates are in screen pixels, but we need to persist normalized image-space coords so annotations survive resize. We scale by `naturalWidth`/`naturalHeight` vs displayed size. Friendship power: MDN's `getBoundingClientRect` docs and a few console.log duels.

**Villain 3: Drag-and-drop reorder across columns** — Moving a card between columns means updating both `status` and `order` for multiple tasks atomically. A dedicated `/api/tasks/reorder/` bulk endpoint keeps the frontend logic clean. Friendship power: `@dnd-kit` docs and DRF serializer validation.

## Project Structure

```
backend/
├── config/          # Django settings & URLs
├── accounts/        # Auth (login, register, JWT)
├── tasks/           # Kanban task models & API
├── annotations/     # Image upload & polygon API
├── media/           # Uploaded images (gitignored)
└── requirements.txt
```
