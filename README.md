# Cairn — Goal Tracker

> Set the goal. Keep the pace. Notice how each day feels.

A warm, calm, responsive goal tracker. Every goal carries one progress track with a
**"should be here"** marker so projected pace vs. actual pace reads at a glance.
Built as a MERN app (MongoDB · Express · React · Node) from the shared Cairn design.

Mobile-first, adapts to a two-pane desktop layout, and installable as a PWA.

## Stack
- **Frontend:** React 18 + Vite, React Router, TanStack Query, framer-motion, @dnd-kit, PWA
- **Backend:** Node + Express, Mongoose, JWT auth (bcrypt), zod validation
- **DB:** MongoDB — uses a real Mongo if `MONGO_URI` is set, otherwise boots an
  **embedded MongoDB** persisted to `./.mongo-data` so it runs with zero setup.

## Quick start
```bash
npm install          # installs client + server workspaces
npm run seed         # creates the demo account + sample goals
npm run dev          # runs API (:4000) and client (:5173) together
```
Open http://localhost:5173 and click **"Try the demo account"** (or use
`demo@cairn.app` / `climbon`). New sign-ups start with an empty onboarding state.

### Using a real MongoDB (optional)
```bash
docker compose up -d                     # starts Mongo on :27017
# then in server/.env:
MONGO_URI=mongodb://localhost:27017/cairn
npm run seed && npm run dev
```

## What's inside
| Screen | Route | Notes |
|---|---|---|
| Auth | `/welcome` | Sign in / create account (email + password) |
| Dashboard | `/` | Greeting, stats, goals by priority, **drag to reorder** |
| Goal detail | `/goals/:id` | actual vs should-be-here, pace badge, live task check-off + emotes |
| New goal | `/goals/new` | name, type, timeframe, rhythm, first tasks |
| History | `/history` | Completed / fell-short recaps + reflections |
| Activity log | `/activity` | Day-by-day check-offs with emotes |
| Trails | `/trails` | Journey view — dots are days, the flag is where you should be |

## The pace engine
The heart of the app lives in [`server/src/lib/pace.js`](server/src/lib/pace.js):
`targetPct = elapsed/total` (the marker), `actualPct = progress/target` (the fill),
and `paceDays` = how many days ahead/behind. Status uses a 3% tolerance band so
long goals read calmly. Covered by `npm test`.

## Scripts
- `npm run dev` — API + client together
- `npm run seed` — reset & seed the demo account
- `npm test` — pace engine unit tests
- `npm run build` — production client build
