from fastapi import APIRouter
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/prediction", tags=["Prediction"])
service = PredictionService()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}
