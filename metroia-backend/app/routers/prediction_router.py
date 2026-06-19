from fastapi import APIRouter, HTTPException, status
from app.controller.prediction_controller import PredictionController
# CORRECCIÓN DE IMPORTACIÓN AQUÍ:
from app.schemas.prediction_schema import SmartPredictionRequest

router = APIRouter(prefix="/prediction", tags=["Prediction"])
controller = PredictionController()

@router.get("/")
def get_all():
    # Retorna lo que tengas mapeado o un preventivo si está vacío por ahora
    return {"success": True, "message": "OK", "data": []}

@router.post("/smart-live")
def get_smart_prediction(payload: SmartPredictionRequest):
    """
    Inferencia de IA contextualizada en el servidor incluyendo analítica de FiftyOne.
    """
    try:
        resultado = controller.get_live_prediction(payload)
        return {"success": True, "message": "Procesado por el servidor con IA", "data": resultado}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/buses-streaming")
def get_buses_in_realtime():
    try:
        buses = controller.prediction_service.obtener_buses_activos()
        return {"success": True, "message": "Flota P8 localizada", "data": buses}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )