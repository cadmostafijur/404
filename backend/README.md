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

## Deployment (PythonAnywhere / Render)

1. Set environment variables above.
2. Run `python manage.py collectstatic`.
3. Configure WSGI to point to `config.wsgi.application`.
4. Serve `/media/` for uploaded images.
5. Set `CORS_ALLOWED_ORIGINS` to your frontend URL.

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
