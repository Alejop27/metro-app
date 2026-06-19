from fastapi import APIRouter
from app.services.heatmap_service import HeatmapService

router = APIRouter(prefix="/heatmap", tags=["Heatmap"])
service = HeatmapService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
