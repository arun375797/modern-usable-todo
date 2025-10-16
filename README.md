# MERN Life Organizer — Tailwind Starter (MVP)

A minimal MERN starter with Tailwind CSS that implements **Today, Inbox, Projects** views, quick-capture parsing, and a basic Express API with Mongo models.

## Quick Start

### 1) Server
```bash
cd server
npm i
cp .env.example .env   # then fill values
npm run dev            # http://localhost:4000
```

### 2) Client
```bash
cd client
npm i
npm run dev            # http://localhost:5173
```

## Env (server/.env)
```
MONGO_URI=mongodb://localhost:27017/organizer
JWT_SECRET=supersecret
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

## Notes
- Tailwind is preconfigured.
- TanStack Query for data fetching, Zustand for UI state.
- Minimal auth (JWT) provided; replace with your real flow later.
- This is a foundation; extend models/routes as you grow.
