from fastapi import APIRouter
from app.services.bus_service import BusService

router = APIRouter(prefix="/buses", tags=["Bus"])
service = BusService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
