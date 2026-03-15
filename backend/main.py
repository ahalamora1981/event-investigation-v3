from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from loguru import logger
import json
import re
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
    channels: Optional[str] = None,
    trade_number: Optional[str] = None,
    score_threshold: Optional[int] = None,
):
    try:
        with open("data/records.json", "r", encoding="utf-8") as f:
            records = json.load(f)

        if not trade_number:
            return {"events": [], "total": 0}

        trades = load_trades(trade_number)
        trade = trades[0] if trades else {}

        scored_events = []
        for record in records:
            if trade:
                scores = score_record(record, trade)
                record["risk"] = scores["risk"]
                record["objectScore"] = scores["objectScore"]
                record["timeScore"] = scores["timeScore"]
                record["contentScore"] = scores["contentScore"]
                record["totalScore"] = scores["totalScore"]
            else:
                record["risk"] = "low"
                record["objectScore"] = 0
                record["timeScore"] = 0
                record["contentScore"] = 0
                record["totalScore"] = 0

            if (
                trade
                and score_threshold is not None
                and record.get("totalScore", 0) < score_threshold
            ):
                continue

            scored_events.append(record)

        filtered = scored_events

        if participant:
            search = participant.lower()
            filtered = [
                r
                for r in filtered
                if search in r.get("participants", {}).get("from", "").lower()
                or search in r.get("participants", {}).get("to", "").lower()
                or search in r.get("content", "").lower()
            ]

        if trade_id:
            search = trade_id.lower()
            filtered = [
                r
                for r in filtered
                if search in r.get("subject", "").lower()
                or search in r.get("content", "").lower()
            ]

        if start_date:
            filtered = [r for r in filtered if r["timestamp"] >= start_date]

        if end_date:
            filtered = [r for r in filtered if r["timestamp"] <= end_date]

        if risk_levels is not None:
            if risk_levels == "":
                filtered = []
            else:
                levels = risk_levels.split(",")
                filtered = [r for r in filtered if r.get("risk") in levels]

        if channels is not None:
            if channels == "":
                filtered = []
            else:
                channel_list = channels.split(",")
                filtered = [r for r in filtered if r.get("channel") in channel_list]

        return {"events": filtered, "total": len(filtered)}

    except FileNotFoundError:
        logger.error("Records file not found")
        raise HTTPException(status_code=500, detail="Data file not found")
    except Exception as e:
        logger.error(f"Error loading events: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/channels")
async def get_channels():
    return {
        "channels": [
            {"id": "phone", "label": "办公电话", "icon": "phone"},
            {"id": "bt", "label": "交易电话", "icon": "headphones"},
            {"id": "qtrade", "label": "QTrade", "icon": "message-square"},
            {"id": "ideal", "label": "iDeal", "icon": "zap"},
            {"id": "reuters", "label": "Reuters", "icon": "newspaper"},
            {"id": "bloomberg", "label": "Bloomberg", "icon": "radio"},
            {"id": "email", "label": "邮件", "icon": "mail"},
        ]
    }


@app.get("/api/risk-levels")
async def get_risk_levels():
    return {
        "risk_levels": [
            {"id": "high", "label": "High Risk", "color": "rose"},
            {"id": "medium", "label": "Medium Risk", "color": "amber"},
            {"id": "low", "label": "Low Risk", "color": "emerald"},
        ]
    }


@app.get("/api/risk-stats")
async def get_risk_stats(
    participant: Optional[str] = None,
    trade_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    risk_levels: Optional[str] = None,
    channels: Optional[str] = None,
    trade_number: Optional[str] = None,
    score_threshold: Optional[int] = None,
):
    try:
        with open("data/records.json", "r", encoding="utf-8") as f:
            records = json.load(f)

        if not trade_number:
            return {"stats": {"high": 0, "medium": 0, "low": 0}, "total": 0}

        trade = {}
        if trade_number:
            trades = load_trades(trade_number)
            trade = trades[0] if trades else {}

        scored_events = []
        for record in records:
            if trade:
                scores = score_record(record, trade)
                record["risk"] = scores["risk"]
                record["objectScore"] = scores["objectScore"]
                record["timeScore"] = scores["timeScore"]
                record["contentScore"] = scores["contentScore"]
                record["totalScore"] = scores["totalScore"]
            else:
                record["risk"] = "low"
                record["objectScore"] = 0
                record["timeScore"] = 0
                record["contentScore"] = 0
                record["totalScore"] = 0

            if (
                trade
                and score_threshold is not None
                and record.get("totalScore", 0) < score_threshold
            ):
                continue

            scored_events.append(record)

        filtered = scored_events

        if participant:
            search = participant.lower()
            filtered = [
                r
                for r in filtered
                if search in r.get("participants", {}).get("from", "").lower()
                or search in r.get("participants", {}).get("to", "").lower()
                or search in r.get("content", "").lower()
            ]

        if trade_id:
            search = trade_id.lower()
            filtered = [
                r
                for r in filtered
                if search in r.get("subject", "").lower()
                or search in r.get("content", "").lower()
            ]

        if start_date:
            filtered = [r for r in filtered if r["timestamp"] >= start_date]

        if end_date:
            filtered = [r for r in filtered if r["timestamp"] <= end_date]

        if risk_levels is not None:
            if risk_levels == "":
                filtered = []
            else:
                levels = risk_levels.split(",")
                filtered = [r for r in filtered if r.get("risk") in levels]

        if channels is not None:
            if channels == "":
                filtered = []
            else:
                channel_list = channels.split(",")
                filtered = [r for r in filtered if r.get("channel") in channel_list]

        stats = {"high": 0, "medium": 0, "low": 0}
        for record in filtered:
            risk = record.get("risk", "low")
            if risk in stats:
                stats[risk] += 1

        return {"stats": stats, "total": len(filtered)}

    except FileNotFoundError:
        logger.error("Records file not found")
        raise HTTPException(status_code=500, detail="Data file not found")
    except Exception as e:
        logger.error(f"Error loading risk stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/trades")
async def get_trades(trade_number: Optional[str] = None):
    try:
        with open("data/trades.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        trades = data.get("trades", [])

        if trade_number:
            trades = [t for t in trades if t.get("tradeNumber") == trade_number]

        return {"trades": trades, "total": len(trades)}

    except FileNotFoundError:
        logger.error("trades.json not found")
        raise HTTPException(status_code=500, detail="Data file not found")
    except Exception as e:
        logger.error(f"Error loading trades: {e}")
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


def load_trades(trade_number: Optional[str] = None) -> List[Dict]:
    try:
        with open("data/trades.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        trades = data.get("trades", [])
        if trade_number:
            trades = [t for t in trades if t.get("tradeNumber") == trade_number]
        return trades
    except:
        return []


def normalize_price(price_str: str) -> float:
    if not price_str:
        return 0.0
    price_str = price_str.replace("%", "").strip()
    if "-" in price_str:
        parts = price_str.split("-")
        try:
            return (float(parts[0]) + float(parts[1])) / 2
        except:
            return 0.0
    try:
        return float(price_str)
    except:
        return 0.0


def normalize_size(size_str: str) -> float:
    if not size_str:
        return 0.0
    size_str = size_str.replace(",", "").strip()
    match = re.search(r"([\d.]+)", size_str)
    if not match:
        return 0.0
    num = float(match.group(1))
    if "万" in size_str:
        return num * 10000
    elif "亿" in size_str:
        return num * 100000000
    elif "手" in size_str:
        return num
    return num


def normalize_direction(direction: str) -> str:
    if not direction:
        return ""
    direction = direction.strip()
    if "买" in direction:
        return "买"
    if "卖" in direction:
        return "卖"
    return direction


def extract_product_codes(text: str) -> List[str]:
    codes = re.findall(r"\b(\d{6})\b", text)
    return codes


def calculate_object_score(participants: Dict, trade: Dict) -> int:
    score = 0
    from_participant = participants.get("from", "")
    to_participant = participants.get("to", "")
    all_text = from_participant + " " + to_participant

    internal_trader = trade.get("internalTrader", "")
    counterparty = trade.get("counterparty", "")
    broker = trade.get("broker", "")

    if internal_trader and internal_trader in all_text:
        return 25
    if counterparty and counterparty in all_text:
        return 15
    if broker and broker in all_text:
        return 10

    return 0


def calculate_time_score(event_time_str: str, trade: Dict) -> int:
    trade_time_str = trade.get("tradeTime", "")

    if not trade_time_str or trade_time_str == "未成交":
        return 12

    try:
        event_time = datetime.fromisoformat(event_time_str.replace(" ", "T"))
        trade_time = datetime.strptime(trade_time_str, "%Y-%m-%d %H:%M:%S")
    except:
        return 12

    diff_minutes = (trade_time - event_time).total_seconds() / 60

    if diff_minutes > 0:
        if diff_minutes <= 10:
            return 25
        elif diff_minutes <= 30:
            return 20
        elif diff_minutes <= 60:
            return 15
        elif diff_minutes <= 120:
            return 10
    else:
        diff_minutes = abs(diff_minutes)
        if diff_minutes <= 5:
            return 15
        elif diff_minutes <= 10:
            return 10
        elif diff_minutes <= 15:
            return 5

    return 0


def calculate_content_score(content: str, subject: str, trade: Dict) -> int:
    full_text = subject + " " + content
    score = 0

    product_code = trade.get("productCode", "")
    product_name = trade.get("productName", "")
    trade_price = trade.get("price", "")
    trade_size = trade.get("tradeSize", "")
    trade_direction = trade.get("direction", "")

    if product_code and product_code in full_text:
        score += 20
    elif product_name:
        name_without_year = re.sub(r"^\d+\s*", "", product_name)
        if name_without_year in full_text:
            score += 18
        elif product_name.replace(" ", "") in full_text.replace(" ", ""):
            score += 18
        elif any(x in full_text for x in ["国开", "原油", "沪金"]):
            score += 15

    price_val = normalize_price(trade_price)
    if price_val > 0:
        prices = re.findall(r"(\d+\.?\d*)%", full_text)
        prices.extend(re.findall(r"(\d+\.?\d*)\s*元", full_text))
        prices.extend(re.findall(r"单价[:：]?\s*(\d+\.?\d*)", full_text))

        found_price = False
        for p in prices:
            p_val = float(p.replace("%", ""))
            if p_val == price_val:
                score += 10
                found_price = True
                break
            elif abs(p_val - price_val) <= 0.01:
                score += 8
                found_price = True
                break

        if not found_price:
            price_range = re.findall(r"(\d+\.?\d*)%-(\d+\.?\d*)%", full_text)
            if price_range:
                low, high = float(price_range[0][0]), float(price_range[0][1])
                if low <= price_val <= high:
                    score += 6

    size_val = normalize_size(trade_size)
    if size_val > 0:
        numbers = re.findall(r"(\d+\.?\d*)\s*(万|亿|手)", full_text)
        found_size = False
        for num, unit in numbers:
            num_val = float(num)
            if unit == "万":
                num_val *= 10000
            elif unit == "亿":
                num_val *= 100000000

            if num_val == size_val:
                score += 7
                found_size = True
                break
            elif size_val > 0 and abs(num_val - size_val) / size_val <= 0.2:
                score += 5
                found_size = True
                break

    dir_val = normalize_direction(trade_direction)
    if dir_val and dir_val in full_text:
        score += 3

    return min(score, 50)


def calculate_risk_level(indicators: list) -> str:
    has_danger = False
    has_warning = False

    for indicator in indicators:
        indicator_type = indicator.get("type", "")
        if indicator_type == "danger":
            has_danger = True
        elif indicator_type == "warning":
            has_warning = True

    if has_danger:
        return "high"
    elif has_warning:
        return "medium"
    return "low"


def score_record(record: Dict, trade: Dict) -> Dict:
    participants = record.get("participants", {})
    content = record.get("content", "")
    subject = record.get("subject", "")
    indicators = record.get("indicators", [])

    object_score = calculate_object_score(participants, trade)
    time_score = calculate_time_score(record.get("timestamp", ""), trade)
    content_score = calculate_content_score(content, subject, trade)

    total_score = object_score + time_score + content_score
    risk_level = calculate_risk_level(indicators)

    return {
        "objectScore": object_score,
        "timeScore": time_score,
        "contentScore": content_score,
        "totalScore": total_score,
        "risk": risk_level,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
