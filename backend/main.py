from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from loguru import logger
import json
import uvicorn

app = FastAPI(title="Esun CCS - Investigation Timeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Indicator(BaseModel):
    type: str
    label: str

class Participants(BaseModel):
    from_: str
    to: str

class CommunicationEvent(BaseModel):
    id: str
    timestamp: str
    channel: str
    risk: str
    participants: dict
    subject: str
    content: str
    duration: Optional[str] = None
    indicators: list[Indicator] = []

@app.get("/api/events")
async def get_events(
    participant: Optional[str] = None,
    trade_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    risk_levels: Optional[str] = None,
    channels: Optional[str] = None
):
    try:
        with open("data/records.json", "r", encoding="utf-8") as f:
            records = json.load(f)
        
        filtered = records
        
        if participant:
            search = participant.lower()
            filtered = [
                r for r in filtered
                if search in r.get("participants", {}).get("from", "").lower()
                or search in r.get("participants", {}).get("to", "").lower()
                or search in r.get("content", "").lower()
            ]
        
        if trade_id:
            search = trade_id.lower()
            filtered = [r for r in filtered if search in r.get("subject", "").lower() or search in r.get("content", "").lower()]
        
        if start_date:
            filtered = [r for r in filtered if r["timestamp"] >= start_date]
        
        if end_date:
            filtered = [r for r in filtered if r["timestamp"] <= end_date]
        
        if risk_levels:
            levels = risk_levels.split(",")
            filtered = [r for r in filtered if r.get("risk") in levels]
        
        if channels:
            channel_list = channels.split(",")
            filtered = [r for r in filtered if r.get("channel") in channel_list]
        
        return {"events": filtered, "total": len(filtered)}
    
    except FileNotFoundError:
        logger.error("records.json not found")
        raise HTTPException(status_code=500, detail="Data file not found")
    except Exception as e:
        logger.error(f"Error loading events: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/events/{event_id}")
async def get_event(event_id: str):
    try:
        with open("data/records.json", "r", encoding="utf-8") as f:
            records = json.load(f)
        
        for record in records:
            if record["id"] == event_id:
                return record
        
        raise HTTPException(status_code=404, detail="Event not found")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/channels")
async def get_channels():
    return {
        "channels": [
            {"id": "phone", "label": "办公电话", "icon": "phone"},
            {"id": "bt", "label": "交易电话", "icon": "headphones"},
            {"id": "meeting", "label": "会议", "icon": "users"},
            {"id": "email", "label": "邮件", "icon": "mail"},
            {"id": "qtrade", "label": "Qtrade", "icon": "message-square"},
            {"id": "ideal", "label": "iDeal", "icon": "zap"}
        ]
    }

@app.get("/api/risk-levels")
async def get_risk_levels():
    return {
        "risk_levels": [
            {"id": "high", "label": "High Risk", "color": "rose"},
            {"id": "medium", "label": "Medium Risk", "color": "amber"},
            {"id": "low", "label": "Low Risk", "color": "emerald"}
        ]
    }

@app.get("/api/risk-stats")
async def get_risk_stats(
    participant: Optional[str] = None,
    trade_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    risk_levels: Optional[str] = None,
    channels: Optional[str] = None
):
    try:
        with open("data/records.json", "r", encoding="utf-8") as f:
            records = json.load(f)
        
        filtered = records
        
        if participant:
            search = participant.lower()
            filtered = [
                r for r in filtered
                if search in r.get("participants", {}).get("from", "").lower()
                or search in r.get("participants", {}).get("to", "").lower()
                or search in r.get("content", "").lower()
            ]
        
        if trade_id:
            search = trade_id.lower()
            filtered = [r for r in filtered if search in r.get("subject", "").lower() or search in r.get("content", "").lower()]
        
        if start_date:
            filtered = [r for r in filtered if r["timestamp"] >= start_date]
        
        if end_date:
            filtered = [r for r in filtered if r["timestamp"] <= end_date]
        
        if risk_levels:
            levels = risk_levels.split(",")
            filtered = [r for r in filtered if r.get("risk") in levels]
        
        if channels:
            channel_list = channels.split(",")
            filtered = [r for r in filtered if r.get("channel") in channel_list]
        
        stats = {"high": 0, "medium": 0, "low": 0}
        for record in filtered:
            risk = record.get("risk", "low")
            if risk in stats:
                stats[risk] += 1
        
        return {"stats": stats, "total": len(filtered)}
    
    except FileNotFoundError:
        logger.error("records.json not found")
        raise HTTPException(status_code=500, detail="Data file not found")
    except Exception as e:
        logger.error(f"Error loading risk stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
