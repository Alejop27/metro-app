from fastapi import APIRouter
from app.services.route_service import RouteService

router = APIRouter(prefix="/routes", tags=["Route"])
service = RouteService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
