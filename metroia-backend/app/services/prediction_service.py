import os
import datetime
import numpy as np
import pandas as pd
import joblib

from app.utils.simulator import BusFlotaSimulator
from app.schemas.prediction_schema import SmartPredictionRequest, SmartPredictionResponse, StationData, AnaliticaVisionData, BusSimuladoData

class PredictionService:
    def __init__(self):
        base_path = os.path.dirname(os.path.dirname(__file__))
        
        self.model_eta = joblib.load(os.path.join(base_path, 'models', 'model_p8_eta.pkl'))
        self.model_ocup = joblib.load(os.path.join(base_path, 'models', 'model_p8_ocup.pkl'))
        self.simulador_flota = BusFlotaSimulator()
        
        self.stops_dict = {}
        self._load_stops(base_path)
        
        self.map_camaras = {0: "Ninguna", 1: "Incident_camera", 2: "Onboard_bus", 3: "Station_camera"}
        self.map_conteo = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
        self.map_incidentes = {0: "Ninguno", 1: "Road_blockage", 2: "Vehicle_breakdown"}
        self.map_intensidad = {0: "Ninguna", 1: "Baja", 2: "Media", 3: "Alta"}
        self.ocupacion_mapeo = {0: "Bajo", 1: "Medio", 2: "Alto"}

    def _load_stops(self, base_path: str):
        stops_path = os.path.join(base_path, 'models', 'db', 'stops.txt')
        df_stops = pd.read_csv(stops_path)
        for _, row in df_stops.iterrows():
            self.stops_dict[int(row['stop_id'])] = {
                'name': str(row['stop_name']), 'lat': float(row['stop_lat']), 'lon': float(row['stop_lon'])
            }

    def _calcular_haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        return np.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2) * 111.0

    def _consultar_servidor_fiftyone(self, origen_id: int) -> dict:
        if origen_id in [10, 11]:
            return {
                "tipo_camara": 1, "conteo_visual": 3, "tipo_incidente": 1,
                "intensidad_incidente": 3, "causes_delay": 1, "estimates_delay": 20.0
            }
        return {
            "tipo_camara": 2, "conteo_visual": 1, "tipo_incidente": 0,
            "intensidad_incidente": 0, "causes_delay": 0, "estimates_delay": 0.0
        }

    def predict_smart_live(self, data: SmartPredictionRequest) -> SmartPredictionResponse:
        ahora = datetime.datetime.now()
        hora_actual = ahora.hour
        dia_parametro = 0 if ahora.weekday() < 5 else 1
        clima_parametro = 1 if (14 <= hora_actual <= 17) else 0 

        # 1. Encontrar parada más cercana al usuario
        closest_stop_id = None
        min_distance = float('inf')
        for stop_id, coords in self.stops_dict.items():
            dist = self._calcular_haversine(data.user_lat, data.user_lon, coords['lat'], coords['lon'])
            if dist < min_distance:
                min_distance = dist
                closest_stop_id = stop_id

        origen_data = self.stops_dict[closest_stop_id]
        destino_data = self.stops_dict[data.destino_id]
        distancia_total_km = self._calcular_haversine(origen_data['lat'], origen_data['lon'], destino_data['lat'], destino_data['lon'])

        # 2. Extraer simulación de toda la flota de buses activa
        flota_buses_raw = self.obtener_buses_activos()
        buses_mapeados = [BusSimuladoData(**bus) for bus in flota_buses_raw]

        # 3. LÓGICA DE ASIGNACIÓN INTELEGENTE DE BUS:
        # Buscamos el bus que esté más cerca de llegar a la parada origen del usuario.
        # Basándonos en el secuencial de paradas (GTFS 1 al 16): el bus ideal es aquel cuya proxima_parada_id <= closest_stop_id
        bus_asignado_id = "BUS-P8-01"  # Valor por defecto seguro
        distancia_minima_al_bus = float('inf')

        for bus in buses_mapeados:
            # Si el bus ya pasó la estación del usuario en este ciclo, se descarta como opción inmediata
            if bus.proxima_parada_id > closest_stop_id:
                continue
            
            # Calculamos la distancia geográfica actual entre el bus y la parada del usuario
            dist_al_usuario = self._calcular_haversine(bus.lat_actual, bus.lon_actual, origen_data['lat'], origen_data['lon'])
            if dist_al_usuario < distancia_minima_al_bus:
                distancia_minima_al_bus = dist_al_usuario
                bus_asignado_id = bus.bus_id

        # 4. Inyectar analítica visual de FiftyOne según la parada asignada
        vision_data = self._consultar_servidor_fiftyone(closest_stop_id)

        # 5. Ejecutar inferencia de los cerebros .pkl con el vector extendido
        input_vector = [[
            closest_stop_id, data.destino_id, hora_actual, clima_parametro, dia_parametro, distancia_total_km,
            vision_data["tipo_camara"], vision_data["conteo_visual"], vision_data["tipo_incidente"],
            vision_data["intensidad_incidente"], vision_data["causes_delay"]
        ]]

        eta_predicho = self.model_eta.predict(input_vector)[0]
        ocup_predicha_idx = self.model_ocup.predict(input_vector)[0]

        return SmartPredictionResponse(
            usuario_ubicado=True,
            parada_mas_cercana=StationData(
                id=closest_stop_id, name=origen_data['name'], lat=origen_data['lat'], lon=origen_data['lon']
            ),
            estacion_destino=StationData(
                id=data.destino_id, name=destino_data['name'], lat=destino_data['lat'], lon=destino_data['lon']
            ),
            distancia_total_km=round(distancia_total_km, 3),
            eta_minutos=round(float(eta_predicho), 1),
            ocupacion_nivel=self.ocupacion_mapeo.get(ocup_predicha_idx, "Desconocido"),
            bus_id_asignado=bus_asignado_id,  # <-- Sincronizado dinámicamente con la predicción
            analitica_camaras=AnaliticaVisionData(
                camara_origen=self.map_camaras[vision_data["tipo_camara"]],
                conteo_pasajeros=self.map_conteo[vision_data["conteo_visual"]],
                incidente_detectado=self.map_incidentes[vision_data["tipo_incidente"]],
                intensidad=self.map_intensidad[vision_data["intensidad_incidente"]],
                genera_retraso=bool(vision_data["causes_delay"]),
                retraso_estimado_minutos=vision_data["estimates_delay"]
            ),
            buses_en_ruta=buses_mapeados,  
            servidor_info={
                "hora_procesada": f"{hora_actual}:00",
                "clima_detectado": "Lluvia" if clima_parametro == 1 else "Despejado",
                "tipo_dia": "Lunes-Viernes" if dia_parametro == 0 else "Fin de Semana"
            }
        )

    def obtener_buses_activos(self):
        return self.simulador_flota.obtener_buses_en_tiempo_real()