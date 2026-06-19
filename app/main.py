from fastapi import FastAPI

from app.routers.routes import router as routes

from app.routers.stations import router as stations

from app.routers.buses import router as buses

from app.routers.prediction import router as prediction

from app.routers.events import router as events

from app.routers.chat import router as chat

from app.routers.gps import router as gps

app = FastAPI(
    title="MetroIA",
    version="1.0"
)

app.include_router(routes)

app.include_router(stations)

app.include_router(buses)

app.include_router(prediction)

app.include_router(events)

app.include_router(chat)

app.include_router(gps)


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "MetroIA Running"
    }