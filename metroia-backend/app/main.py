from fastapi import FastAPI
from app.routers import (
    route_router, station_router, bus_router,
    gps_router, prediction_router, heatmap_router,
    event_router, chat_router,
)

app = FastAPI(title="MetroIA API", version="1.0.0")

app.include_router(route_router.router)
app.include_router(station_router.router)
app.include_router(bus_router.router)
app.include_router(gps_router.router)
app.include_router(prediction_router.router)
app.include_router(heatmap_router.router)
app.include_router(event_router.router)
app.include_router(chat_router.router)


@app.get("/health")
def health():
    return {"success": True, "message": "OK", "data": {"status": "running"}}
