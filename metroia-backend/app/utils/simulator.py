import os
from datetime import datetime
import pandas as pd
import numpy as np

class BusFlotaSimulator:
    def __init__(self):
        base_path = os.path.dirname(os.path.abspath(__file__)) # app/utils/
        root_path = os.path.dirname(base_path)                 # app/
        
        self.stop_times_path = os.path.join(root_path, 'models', 'db', 'stop_times.txt')
        self.stops_path = os.path.join(root_path, 'models', 'db', 'stops.txt')
        
        self.stops_coords = {}
        self._load_data()

    def _load_data(self):
        try:
            df_stops = pd.read_csv(self.stops_path)
            for _, row in df_stops.iterrows():
                self.stops_coords[int(row['stop_id'])] = {
                    'name': str(row['stop_name']), 
                    'lat': float(row['stop_lat']), 
                    'lon': float(row['stop_lon'])
                }
        except Exception as e:
            print(f"Error crítico cargando datos en el simulador de buses: {e}")

    def obtener_buses_en_tiempo_real(self):
        """
        Calcula la posición de 3 buses de la ruta P8 en tiempo real.
        Cada bus se desfasa en el tiempo para simular una frecuencia de despacho controlada.
        """
        ahora = datetime.now() 
        buses_activos = []
        
        # Configuramos los 3 buses con un desfase de ciclo para que estén en puntos distintos de la ruta
        config_buses = [
            {"id": "BUS-P8-01", "desfase_minutos": 0, "sentido": "OUT"},
            {"id": "BUS-P8-02", "desfase_minutos": 6, "sentido": "OUT"},
            {"id": "BUS-P8-03", "desfase_minutos": 12, "sentido": "OUT"}
        ]
        
        for config in config_buses:
            # Aplicamos el desfase al minuto actual para posicionar al bus en su respectivo tramo
            minuto_ciclo = (ahora.minute + config["desfase_minutos"]) % 20  
            
            # Deducción de la secuencia de paradas (de 1 a 16) según el avance del ciclo
            stop_sequence_actual = max(1, min(16, int(minuto_ciclo / 1.2) + 1)) 
            next_stop = min(16, stop_sequence_actual + 1)
            
            if stop_sequence_actual in self.stops_coords and next_stop in self.stops_coords:
                coord_origen = self.stops_coords[stop_sequence_actual]
                coord_destino = self.stops_coords[next_stop]
                
                # Interpolación matemática para el desplazamiento fluido
                factor_movimiento = (minuto_ciclo % 1.2) / 1.2
                bus_lat = coord_origen['lat'] + (coord_destino['lat'] - coord_origen['lat']) * factor_movimiento
                bus_lon = coord_origen['lon'] + (coord_destino['lon'] - coord_origen['lon']) * factor_movimiento

                buses_activos.append({
                    "bus_id": config["id"],
                    "ruta": "P8",
                    "sentido": config["sentido"],
                    "lat_actual": round(bus_lat, 6),
                    "lon_actual": round(bus_lon, 6),
                    "proxima_parada_id": next_stop,
                    "nombre_proxima_parada": coord_destino['name'],
                    "velocidad_aprox_kmh": 24.5 if minuto_ciclo % 2 == 0 else 28.0
                })

        return buses_activos