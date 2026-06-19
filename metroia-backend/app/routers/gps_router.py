from fastapi import APIRouter
from app.services.gps_service import GpsService

router = APIRouter(prefix="/gps", tags=["Gps"])
service = GpsService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
