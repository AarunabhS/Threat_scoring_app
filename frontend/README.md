# Threat Scoring Dashboard (React + Vite)

A lightweight React scaffold mirroring the folder layout you shared (Vite + Recharts + Lucide). It ships with sample threat-scoring data and charts so you can plug in your own JSON later.

## Structure
- `public/` static assets placeholder
- `src/`
  - `data/masterData.js` sample company data and metric config
  - `App.jsx` main UI (cards, bar chart, radar, table)
  - `App.css` styles
  - `index.css` globals/fonts/background
  - `main.jsx` entry
- `vite.config.js`, `eslint.config.js`, `package.json`

## Getting started
```bash
cd frontend
npm install   # installs React, Vite, Recharts, Lucide, etc.
npm run dev   # opens http://localhost:5173
```

## Customizing
- Update `src/data/masterData.js` with your own companies/metrics.
- Extend the chart colors or cards by editing `metricConfig` or `App.jsx`.

No backend required; this is a client-only demo shell.
