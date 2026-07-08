# G-Scores

Fullstack JavaScript solution for the Golden Owl Solutions Web Developer Intern ability test.

## Live Demo

- Frontend: https://g-scores-thanh-sang.netlify.app
- Backend health check: https://g-scores-api-i855.onrender.com/health

## Features

- Import `diem_thi_thpt_2024.csv` into PostgreSQL with a streaming, batched importer.
- Search scores by 8-digit registration number.
- Report score distribution for each subject across 4 levels: `>= 8`, `6 - 7.99`, `4 - 5.99`, `< 4`.
- List top 10 Group A students by `math + physics + chemistry`.
- Responsive React dashboard with loading, error, and empty states.
- Docker Compose setup for local PostgreSQL.

## Tech Stack

- Frontend: React, Vite, TypeScript, React Hooks, Recharts, Tailwind CSS
- Backend: Express.js, TypeScript, Prisma ORM
- Database: PostgreSQL
- Tests: Vitest, Supertest
- Deployment target: Netlify frontend, Render backend, Neon PostgreSQL

## Project Structure

```text
backend/    Express API, Prisma schema, importer, tests
frontend/   React Vite dashboard
dataset/    CSV source file
```

## Environment

Copy `.env.example` to `.env` and fill the database URLs.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/g_scores?schema=public"
DATABASE_URL_DIRECT=""
PORT=4000
CORS_ORIGIN="http://localhost:5173"
VITE_API_BASE_URL="http://localhost:4000"
```

For Neon, use the pooled URL for `DATABASE_URL` and the direct URL for `DATABASE_URL_DIRECT` when available.

## Local Setup

Install dependencies:

```bash
npm install
```

Start local PostgreSQL:

```bash
npm run db:up
```

Apply Prisma migration:

```bash
npm run db:migrate
```

Import the full CSV:

```bash
npm run import:scores -- --reset
```

For a fast smoke test:

```bash
npm run import:scores -- --limit 1000 --reset
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

## Verification

Run tests:

```bash
npm test
```

Build all workspaces:

```bash
npm run build
```

Manual API checks:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/scores/01000001
curl http://localhost:4000/api/reports/score-levels
curl http://localhost:4000/api/top/group-a
```

## API

```text
GET /health
GET /api/scores/:sbd
GET /api/reports/score-levels
GET /api/top/group-a?limit=10
```

## Architecture Notes

The backend keeps the domain logic small and explicit:

- `Subject` class owns score band classification.
- `SubjectRegistry` defines supported subjects and their CSV mappings.
- `ScoreImportService` streams CSV rows and writes PostgreSQL batches through Prisma.
- `StudentScoreService` handles lookup and Group A ranking validation.
- `ReportService` exposes score-level statistics through SQL aggregation.

This keeps the OOP requirement focused on the real domain instead of adding unnecessary layers.

## Deployment

### Backend on Render

Environment variables:

```env
DATABASE_URL="Neon pooled connection string"
DATABASE_URL_DIRECT="Neon direct connection string"
CORS_ORIGIN="https://your-netlify-site.netlify.app"
NODE_ENV="production"
```

Build command:

```bash
npm install && npm run build --workspace backend
```

Pre-deploy command:

```bash
npm run db:deploy --workspace backend
```

Start command:

```bash
npm run start --workspace backend
```

Run the importer once from a Render shell or job:

```bash
npm run import:scores --workspace backend -- --reset
```

On Render Free, shell access is not available. For the live demo, the CSV import can be run locally against the Neon database before deployment.

### Frontend on Netlify

Build command:

```bash
npm run build --workspace frontend
```

Publish directory:

```text
frontend/dist
```

Environment variable:

```env
VITE_API_BASE_URL="https://your-render-backend.onrender.com"
```

After Netlify provides the frontend URL, update Render `CORS_ORIGIN` and redeploy the backend.
