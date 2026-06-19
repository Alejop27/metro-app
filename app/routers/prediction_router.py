from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse
from app.controllers.prediction_controller import PredictionController

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)

# Instanciamos el controlador (idealmente usarías inyección de dependencias,
# pero esto resuelve directo y limpio para las 6 horas de entrega)
controller = PredictionController()

@router.post("/live", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def get_prediction(payload: PredictionRequest):
    try:
        return controller.get_live_prediction(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la predicción de IA: {str(e)}"
        )