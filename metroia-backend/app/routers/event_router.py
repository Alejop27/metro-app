from fastapi import APIRouter
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["Event"])
service = EventService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
