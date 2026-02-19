from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
from .database import engine, get_session, init_db
from .models import Insight

app = FastAPI(title="Threat Scoring API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/insights", response_model=List[Insight])
def read_insights(session: Session = Depends(get_session)):
    insights = session.exec(select(Insight)).all()
    return insights

@app.get("/api/insights/{insight_id}", response_model=Insight)
def read_insight(insight_id: str, session: Session = Depends(get_session)):
    insight = session.get(Insight, insight_id)
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return insight

@app.post("/api/insights", response_model=Insight)
def create_insight(insight: Insight, session: Session = Depends(get_session)):
    session.add(insight)
    session.commit()
    session.refresh(insight)
    return insight
