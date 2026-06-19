from fastapi import APIRouter
from app.services.station_service import StationService

router = APIRouter(prefix="/stations", tags=["Station"])
service = StationService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
