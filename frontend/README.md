# 404 Project — Frontend

Next.js + TypeScript frontend for the 404 Project — a 2-in-1 task management Kanban board and image polygon annotation tool.

## Tech Stack

- **Node.js** 22.x
- **Next.js** 16 (App Router)
- **TypeScript**
- **Tailwind CSS** 4
- **Zustand** — auth & date state
- **@dnd-kit** — drag-and-drop Kanban
- **date-fns** — date utilities
- **lucide-react** — icons

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Email/password login |
| `/tasks` | Kanban board with date picker |
| `/annotate` | Image upload & polygon annotation |

## Components

- `<DateSelector />` — reusable date picker (shared across task views)
- `<Board />`, `<Column />`, `<TaskCard />` — modular Kanban structure
- `<TaskModal />` — add/edit task modal
- `<AnnotationWorkspace />` — scrollable multi-image annotation area
- `<PolygonCanvas />` — draw, save, and delete polygons on images

## Setup & Run

### Prerequisites

- Node.js 22.x (tested with v22.12.0)
- npm
- Backend running at `http://localhost:8000`

### Steps

```bash
cd frontend
npm install
cp .env.local.example .env.local   # or create .env.local manually
npm run dev
```

Open **http://localhost:3000**.

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL.

## Demo Login

| Field | Value |
|-------|-------|
| Email | `demo@404project.com` |
| Password | `demo1234` |

## Deployment (Vercel)

1. Push this folder to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com).
3. Set `NEXT_PUBLIC_API_URL` to your production backend URL.
4. Deploy.

## Villains Faced & How We Won

**Villain 1: SVG overlay alignment on responsive images** — Polygons drawn on a scaled `<img>` must map back to original pixel coordinates for the API. We track `naturalWidth`/`naturalHeight` on load and scale every point. Friendship power: Stack Overflow threads on SVG-over-image patterns.

**Villain 2: Cross-column drag-and-drop state** — `@dnd-kit` handles within-column sorting well, but moving between columns requires manual status updates plus a backend reorder call. We used `closestCorners` collision detection and a bulk reorder endpoint. Friendship power: dnd-kit examples repo.

**Villain 3: Auth hydration flash** — Zustand `persist` middleware can briefly show protected pages before redirecting. `<AuthGuard>` shows a spinner until the token is confirmed. Friendship power: Zustand persist docs.

**Villain 4: Decoupling date logic from task UI** — `useDateStore` (Zustand) holds `selectedDate`; `<DateSelector />` is a dumb component; `<Board />` only receives `taskDate` as a prop. Date changes never leak into card rendering logic.

## Project Structure

```
frontend/src/
├── app/
│   ├── login/page.tsx
│   ├── tasks/page.tsx
│   └── annotate/page.tsx
├── components/
│   ├── DateSelector.tsx
│   ├── Navbar.tsx
│   ├── AuthGuard.tsx
│   ├── tasks/       # Board, Column, TaskCard, TaskModal
│   └── annotate/    # ImageUploader, PolygonCanvas, AnnotationWorkspace
└── lib/
    ├── api.ts       # Backend API client
    ├── store.ts     # Zustand stores
    └── types.ts     # TypeScript interfaces
```
