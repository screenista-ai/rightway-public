# rightway-public

Marketing website for RightWay AI.

## Host

`rightway.com`

## API

Talks only to `rightway-api` / `api.rightway.com`. Auth + RBAC live in the API.

## Branches

- `main` — production
- `develop` — integration
- `feature/*` / `fix/*` — work branches

## Dev

```bash
npm install
cp .env.example .env
npm run dev
```
