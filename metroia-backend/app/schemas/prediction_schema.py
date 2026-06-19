from pydantic import BaseModel, Field
from typing import List

class SmartPredictionRequest(BaseModel):
    user_lat: float = Field(..., description="Latitud GPS actual del usuario")
    user_lon: float = Field(..., description="Longitud GPS actual del usuario")
    destino_id: int = Field(..., description="ID de la estación destino")

class AnaliticaVisionData(BaseModel):
    camara_origen: str          
    conteo_pasajeros: str       
    incidente_detectado: str    
    intensidad: str             
    genera_retraso: bool
    retraso_estimado_minutos: float

class StationData(BaseModel):
    id: int
    name: str
    lat: float
    lon: float

class BusSimuladoData(BaseModel):
    bus_id: str
    ruta: str
    sentido: str
    lat_actual: float
    lon_actual: float
    proxima_parada_id: int
    nombre_proxima_parada: str
    velocidad_aprox_kmh: float

class SmartPredictionResponse(BaseModel):
    usuario_ubicado: bool
    parada_mas_cercana: StationData
    estacion_destino: StationData
    distancia_total_km: float
    eta_minutos: float
    ocupacion_nivel: str
    bus_id_asignado: str  # <-- NUEVO: ID del bus específico que resolverá el viaje
    analitica_camaras: AnaliticaVisionData  
    buses_en_ruta: List[BusSimuladoData]  
    servidor_info: dict