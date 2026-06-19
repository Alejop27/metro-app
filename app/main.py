from fastapi import FastAPI

from app.routers.route_router import router as route_router
from app.routers.station_router import router as station_router
from app.routers.bus_router import router as bus_router
from app.routers.gps_router import router as gps_router
from app.routers.prediction_router import router as prediction_router
from app.routers.chat_router import router as chat_router
from app.routers.heatmap_router import router as heatmap_router
from app.routers.event_router import router as event_router

app = FastAPI(
    title="MetroIA API",
    version="1.0.0"
)

app.include_router(route_router)
app.include_router(station_router)
app.include_router(bus_router)
app.include_router(gps_router)
app.include_router(prediction_router)
app.include_router(chat_router)
app.include_router(heatmap_router)
app.include_router(event_router)


@app.get("/")
def root():
    return {
        "message": "MetroIA Backend",
        "status": "running"
    }