from fastapi import APIRouter, HTTPException, status

from app.controller.prediction_controller import PredictionController
from app.schemas.prediction_schema import PredictionRequest
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/prediction", tags=["Prediction"])
service = PredictionService()

# Instanciamos el controlador que a su vez inicializa el PredictionService con los .pkl
controller = PredictionController()


@router.get("/")
def get_all():
    data = service.get_all()
    return {"success": True, "message": "OK", "data": data}


@router.post("/live")
def get_live_prediction(payload: PredictionRequest):
    """
    Endpoint para obtener el ETA y nivel de ocupación en tiempo real
    utilizando los modelos de Machine Learning (.pkl) y los datos GTFS.
    """
    try:
        resultado = controller.get_live_prediction(payload)
        return {"success": True, "message": "Predicción generada con éxito", "data": resultado}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado en el servidor: {str(e)}"
        )