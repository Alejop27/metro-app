from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    origen_id: int = Field(..., description="ID de la estación de origen", example=11)
    destino_id: int = Field(..., description="ID de la estación de destino", example=10)
    hora: int = Field(..., ge=0, le=23, description="Hora del día (0-23)", example=18)
    clima: int = Field(..., ge=0, le=1, description="0: Despejado, 1: Lluvia", example=1)
    dia: int = Field(..., ge=0, le=1, description="0: Lunes-Viernes, 1: Fin de semana", example=0)

class PredictionResponse(BaseModel):
    origen_id: int
    destino_id: int
    distancia_calculada_km: float
    eta_minutos: float
    ocupacion_nivel: str  # "Bajo", "Medio", "Alto"