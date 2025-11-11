# Faculty Research Grant Proposal Tracker

A lightweight full‑stack app to track research grant proposals end‑to‑end with clean CRUD, deadline awareness, and simple KPIs.

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Vite)

## Features
- Create, read, update, and delete proposals
- Search and status filter (draft/submitted/under-review/approved/rejected)
- Overdue deadline highlighting
- KPIs: total proposals, approvals, pending, total approved funding
- Theme switcher with persistence (localStorage)

## Project Structure
```
E:\FSD\
  backend\        # Express API + Mongoose models
  Research\       # Vite + React frontend
```

## Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)

## Environment Variables
Create `.env` files as needed (they are gitignored).

Backend (`E:\FSD\backend\.env`):
```
MONGODB_URI=mongodb://localhost:27017/fsd
PORT=4000
```

Frontend (`E:\FSD\Research\.env` for local dev pointing at backend):
```
VITE_API_BASE=http://localhost:4000/api
```

## Quick Start

1) Install dependencies
```
cd backend
npm install

cd ../Research
npm install
```

2) Start backend API
```
cd ../backend
npm start
# Server: http://localhost:4000
# Health:  http://localhost:4000/api/health
```

3) Start frontend
```
cd ../Research
npm run dev
# Vite dev server: prints a local URL (e.g., http://localhost:5173)
```

4) Open the frontend URL in your browser.

## API Overview (Backend)
Base URL: `http://localhost:4000/api`

- Health
  - GET `/health` → `{ ok: true }`

- Proposals
  - GET `/proposals` → list proposals (newest first)
  - POST `/proposals` → create proposal
  - PUT `/proposals/:id` → update proposal
  - DELETE `/proposals/:id` → delete proposal
  - DELETE `/proposals` → delete all proposals
  - GET `/proposals/ping` → simple probe `{ ok: true, feature: 'proposals' }`

- Usages (auxiliary analytics endpoints)
  - GET `/usages`
  - POST `/usages`
  - DELETE `/usages/:id`
  - DELETE `/usages`

## Common Issues
- 500 errors on API calls
  - Ensure MongoDB is running and `MONGODB_URI` is correct.
  - Check backend console for detailed error logs.
- CORS during dev
  - Backend enables CORS; ensure `VITE_API_BASE` points to the backend (`/api` in production behind same origin).

## Scripts
Backend (`backend/package.json`):
- `npm start` → start server

Frontend (`Research/package.json`):
- `npm run dev` → start Vite dev server
- `npm run build` → production build
- `npm run preview` → preview built app

## License
MIT (or your preference).

