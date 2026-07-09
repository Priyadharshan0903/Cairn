# Deploying Cairn to Railway

Cairn deploys as a **single Railway service**: the Express server serves the API
**and** the built React app from one origin. You add one **MongoDB** database.
(The embedded dev database is never used in production.)

```
Browser ──▶ Railway service (Express)
                 ├─ /api/*   → REST API
                 └─ /*       → built React SPA (client/dist)
                          │
                          ▼
                    MongoDB (Atlas or Railway plugin)
```

## 1. Provision MongoDB
Pick one:

**A. MongoDB Atlas (recommended — free M0 tier, fully managed)**
1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. Database Access → add a user (username + password).
3. Network Access → allow `0.0.0.0/0` (Railway egress IPs aren't fixed).
4. Copy the connection string, e.g.
   `mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/cairn?retryWrites=true&w=majority`
   (make sure the `/cairn` database name is in the path).

**B. Railway's own MongoDB**
In your Railway project: **New → Database → Add MongoDB**. Railway exposes a
connection variable (e.g. `MONGO_URL`) you can reference from the app service.

## 2. Create the Railway service
1. Push this repo to GitHub (already done).
2. Railway → **New Project → Deploy from GitHub repo** → pick this repo.
3. Railway auto-detects Node and uses `nixpacks.toml` in the repo root, which:
   install (`npm install --include=dev`) → build (`npm run build`) → start (`npm start`).
   No build/start commands need to be set by hand.

## 3. Set environment variables
On the service's **Variables** tab:

| Variable        | Value                                                            |
|-----------------|------------------------------------------------------------------|
| `MONGO_URI`     | your Atlas string, or `${{MongoDB.MONGO_URL}}` to reference Railway's DB |
| `JWT_SECRET`    | a long random string (e.g. `openssl rand -hex 32`)               |
| `NODE_ENV`      | `production`                                                     |
| `NPM_CONFIG_PRODUCTION` | `false`  *(ensures Vite/devDeps install for the build)*  |

Railway injects `PORT` automatically — the server already reads `process.env.PORT`.
You do **not** need `CLIENT_ORIGIN` (same-origin), but you may set it to your
Railway domain if you later split the frontend onto its own service.

## 4. Deploy & get a domain
- Railway builds and deploys on push. Watch the build logs.
- Under **Settings → Networking → Generate Domain** to get a public URL.
- Visit it — you should see the Cairn sign-in screen. `GET /api/health` returns
  `{"ok":true,"service":"cairn"}`.

## 5. (Optional) Seed the demo account in production
Using the [Railway CLI](https://docs.railway.app/develop/cli):
```bash
railway link           # select the project/service
railway run npm run seed
```
This creates `demo@cairn.app` / `climbon` with sample goals in your production DB.
Skip this if you want every account to start empty.

---

## Alternative: two services (split frontend/back end)
Only needed if you want the React app on a CDN/static host separate from the API:
- **API service**: root dir `.`, start `npm start --workspace server`, set `MONGO_URI`,
  `JWT_SECRET`, and `CLIENT_ORIGIN=https://<your-frontend-domain>`.
- **Frontend**: build `npm run build --workspace client`, publish `client/dist` on a
  static host, and point the app at the API by giving the fetch client a base URL
  (currently it calls same-origin `/api`; you'd add `VITE_API_URL` and prefix requests).

The single-service setup above avoids all of this — prefer it unless you specifically
need a separate static host.

## Troubleshooting
- **Build fails: `vite: not found`** → set `NPM_CONFIG_PRODUCTION=false` (devDeps skipped).
- **App boots then crashes: `MONGO_URI is required in production`** → set `MONGO_URI`.
- **Blank page / 404 on refresh of `/profile`** → ensure the client built (`client/dist`
  exists in the deploy); the server's SPA fallback needs it.
- **Mongo connection timeout** → in Atlas, confirm Network Access allows `0.0.0.0/0`.
