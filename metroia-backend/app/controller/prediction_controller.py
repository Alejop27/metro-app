from fastapi import HTTPException, status
from app.services.prediction_service import PredictionService
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse

class PredictionController:
    def __init__(self):
        self.prediction_service = PredictionService()

    def get_live_prediction(self, request_data: PredictionRequest) -> PredictionResponse:
        try:
            return self.prediction_service.predict_eta_and_occupancy(request_data)
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