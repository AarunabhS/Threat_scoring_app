# Beam Data Intelligence Dashboard

A comprehensive strategic monitoring platform for competitor analytics, threat scoring, and real-time strategic signals.

## 🚀 Overview

The Beam Data Intelligence Dashboard provides a multi-dimensional view of the competitive landscape, combining regional risk profiles, financial heatmaps, and AI-driven "Insight Engine" signals (Hiring Trends, Tech Pivots, Market Expansion).

## ✨ Key Features

- **Interactive Insights Engine**: Click-to-expand details on strategic signals like hiring surges and tech stack shifts.
- **Executive Market Matrix**: High-level comparison of market outliers and industry leaders.
- **Dynamic Radar Charts**: Benchmark individual company performance against industry averages across 8 KPIs.
- **Heatmap Analytics**: Visual representation of metric performance across the entire competitor set.
- **Company Dossier**: Deep-dive intelligence including tech stack, employee growth, and IPO status.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Modern, responsive UI)
- **Recharts** (Data visualization)
- **Lucide React** (Iconography)
- **Framer Motion** (Smooth animations)

### Backend
- **FastAPI** (Python asynchronous backend)
- **SQLModel** (SQLAlchemy + Pydantic integration)
- **Uvicorn** (ASGI server)
- **PostgreSQL** (Relational database)

## 📦 Project Structure

```bash
├── backend/                # FastAPI application
│   ├── main.py             # API routes
│   ├── database.py         # DB connection & initialization
│   ├── models.py           # SQLModel schemas
│   ├── seed.py             # Script to populate database
│   └── aws_config.sh       # AWS SSM Bastion tunnel script
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx         # Main dashboard logic
│   │   ├── data/           # Intelligence & Master datasets
│   └── tailwind.config.js  # UI configuration
└── .gitignore              # Repository safety rules
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **AWS CLI** (for DB tunnel access)

### 2. Backend Setup
```bash
# Set up virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlmodel psycopg2-binary

# Configure environment
# Ensure backend/.env contains DATABASE_URL and AWS credentials

# Start AWS SSM Tunnel (if accessing remote RDS)
bash backend/aws_config.sh

# Run the API server
uvicorn backend.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Security Note
Ensure that `.env` files and AWS secrets are never committed to the repository. A root `.gitignore` is provided to maintain repository hygiene.
