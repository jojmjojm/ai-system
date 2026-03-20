# AISM — AI Site Monitor

Scan websites for AI readiness. Score 0-100 with issues and recommendations.

## Quick Start

```bash
# Install
npm install && cd api && npm install && cd ..

# Build frontend
npm run build

# Start (serves frontend + API on port 3001)
NODE_ENV=production node api/server.js
```

## Development

```bash
# Terminal 1: API
npm run api

# Terminal 2: Frontend (proxies /api to :3001)
npm run dev
```

## Production Deploy (this server)

```bash
# First time
bash scripts/manage.sh install

# Add to /etc/caddy/Caddyfile (see deploy/Caddyfile.aism)
# Add Cloudflare Tunnel hostname: aism.dk → http://localhost:8081

# Future deploys
bash scripts/manage.sh deploy
```

## Structure

```
aism/
├── src/           # React frontend (Vite + Tailwind)
├── api/           # Express API (scanner + leads)
├── dist/          # Built frontend (generated)
├── deploy/        # systemd + Caddy configs
├── scripts/       # Management scripts
├── data/          # Leads storage (generated)
└── .env           # Configuration
```

## Environment Variables

See `.env.example`
