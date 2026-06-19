import os
import numpy as np
import pandas as pd
import joblib
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse


class PredictionService:
    def __init__(self):
        # 1. Rutas base del proyecto
        base_path = os.path.dirname(os.path.dirname(__file__))

        # 2. Cargar modelos de IA en memoria
        self.model_eta = joblib.load(os.path.join(base_path, 'models', 'model_p8_eta.pkl'))
        self.model_ocup = joblib.load(os.path.join(base_path, 'models', 'model_p8_ocup.pkl'))
        self.ocupacion_mapeo = {0: "Bajo", 1: "Medio", 2: "Alto"}

        # 3. Cargar diccionario de coordenadas desde stops.txt
        self.stops_coords = {}
        self._load_stops_database(base_path)

    def _load_stops_database(self, base_path: str):
        """Carga de forma eficiente las paradas en un diccionario de rápido acceso"""
        stops_file_path = os.path.join(base_path, 'models', 'db', 'stops.txt')
        try:
            df_stops = pd.read_csv(stops_file_path)
            for _, row in df_stops.iterrows():
                self.stops_coords[int(row['stop_id'])] = {
                    'lat': float(row['stop_lat']),
                    'lon': float(row['stop_lon'])
                }
        except Exception as e:
            # Fallback o log si el archivo no se encuentra
            print(f"Error crítico cargando la base de datos GTFS: {e}")

    def _calcular_haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcula la distancia aproximada en km entre dos puntos (Haversine simple)"""
        # Multiplicador promedio para conversión de grados a km en Santander
        return np.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) * 111.0

    def predict_eta_and_occupancy(self, data: PredictionRequest) -> PredictionResponse:
        # Validar que ambas paradas existan en nuestro mapa GTFS
        if data.origen_id not in self.stops_coords or data.destino_id not in self.stops_coords:
            raise ValueError(f"ID de estación no válido en el mapa GTFS de la ruta P8.")

        # Obtener coordenadas reales
        origen = self.stops_coords[data.origen_id]
        destino = self.stops_coords[data.destino_id]

        # Calcular la distancia real en km de forma automática
        distancia_km = self._calcular_haversine(
            origen['lat'], origen['lon'],
            destino['lat'], destino['lon']
        )

        # Construir el vector exacto con el que entrenamos los RandomForest
        input_data = [[
            data.origen_id,
            data.destino_id,
            data.hora,
            data.clima,
            data.dia,
            distancia_km
        ]]

        # Ejecutar inferencia de los cerebros .pkl
        eta_predicho = self.model_eta.predict(input_data)[0]
        ocup_predicha_idx = self.model_ocup.predict(input_data)[0]

        return PredictionResponse(
            origen_id=data.origen_id,
            destino_id=data.destino_id,
            distancia_calculada_km=round(distancia_km, 3),
            eta_minutos=round(float(eta_predicho), 1),
            ocupacion_nivel=self.ocupacion_mapeo.get(ocup_predicha_idx, "Desconocido")
        )