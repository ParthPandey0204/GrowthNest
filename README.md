# GrowthNest

GrowthNest is a full-stack mentoring platform for programs, lessons, enrollments,
assignments, submissions, sessions, uploads, and administration.

## Project structure

```text
GrowthNest/
├── backend/    Express, Prisma, PostgreSQL API
└── frontend/   React and Vite application
```

## Run locally

Create `backend/.env` with `DATABASE_URL` and `JWT_SECRET` (and Cloudinary values
when using media uploads), then start the API:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm start
```

In a second terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` when the API is not running at
`http://localhost:5000`.

## Checks

```bash
cd frontend
npm run lint
npm run build

cd ../backend
node --check server.js
```
