from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Column, JSON
import uuid

class Insight(SQLModel, table=True):
    __tablename__ = "threat_insights"
    __table_args__ = {"schema": "competitor_monitoring_final"}
    id: str = Field(primary_key=True)
    company_name: str
    summary: str
    services: str
    segments: str
    tech: str
    size_band: str
    region: str
    signals: str
    job_postings_count: int
    hiring_locations: str
    tech_mentions: str
    activity_recency: int
    new_product_line: bool
    trend_hiring: bool
    tech_stack_pivot: bool
    market_expansion: bool
    capability_expansion: bool
    inactive: bool
    insight_summary: str
    competitive_impact: str
    recommended_action: str
    tags: List[str] = Field(sa_column=Column(JSON))
    flag_details: Dict[str, str] = Field(sa_column=Column(JSON))
