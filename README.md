# Esun CCS - Investigation Timeline

## Project Structure

```
event-investigation-v3/
├── backend/              # FastAPI backend
│   ├── main.py          # FastAPI application
│   ├── data/
│   │   └── records.json # Communication records
│   └── pyproject.toml   # Python dependencies
└── frontend/            # React frontend
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # React components
    │   └── App.jsx      # Main app component
    └── package.json     # Node dependencies
```

## Quick Start

### Backend

```bash
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at http://localhost:8000
API docs at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at http://localhost:5173

## Features

- **Timeline View**: Visual timeline of communication events
- **Filters**: Filter by participant, trade ID, date range, risk level, and channel
- **Channels**: 办公电话，交易电话，会议，邮件，Qtrade, iDeal
- **Risk Levels**: High, Medium, Low risk indicators
- **Real-time Filtering**: Dynamic filtering as you type

## API Endpoints

- `GET /api/events` - Get all events with optional filters
- `GET /api/events/{id}` - Get single event by ID
- `GET /api/channels` - Get available channels
- `GET /api/risk-levels` - Get risk level definitions
