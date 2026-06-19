from fastapi import HTTPException, status
from app.services.prediction_service import PredictionService
# CORRECCIÓN DE IMPORTACIÓN AQUÍ:
from app.schemas.prediction_schema import SmartPredictionRequest, SmartPredictionResponse

class PredictionController:
    def __init__(self):
        self.prediction_service = PredictionService()

    def get_live_prediction(self, request_data: SmartPredictionRequest) -> SmartPredictionResponse:
        try:
            return self.prediction_service.predict_smart_live(request_data)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Fallo en el motor de inferencia: {str(e)}"
            )