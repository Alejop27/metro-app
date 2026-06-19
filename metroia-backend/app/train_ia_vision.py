import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

import pandas as pd
import numpy as np
import joblib
import os  # <-- Asegúrate de importar os
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

# 1. DETECTAR LAS RUTAS DINÁMICAMENTE
# Obtiene la ruta del directorio actual donde vive este script (app/)
base_path = os.path.dirname(os.path.abspath(__file__))

# Construye las rutas absolutas exactas a los archivos
stops_path = os.path.join(base_path, 'models', 'db', 'stops.txt')
stop_times_path = os.path.join(base_path, 'models', 'db', 'stop_times.txt')

# Cargar tus archivos utilizando las rutas seguras
stops = pd.read_csv(stops_path)
stop_times = pd.read_csv(stop_times_path)

def haversine(lat1, lon1, lat2, lon2):
    return np.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2) * 111.0

def generar_dataset_vision(n_muestras=4000):
    data = []
    ruta_completa = pd.merge(stop_times, stops, on='stop_id')
    ruta_completa = ruta_completa.sort_values(by=['trip_id', 'stop_sequence'])

    for _ in range(n_muestras):
        idx = np.random.randint(0, len(ruta_completa) - 1)
        parada_actual = ruta_completa.iloc[idx]
        parada_siguiente = ruta_completa.iloc[idx + 1]
        
        if parada_actual['trip_id'] != parada_siguiente['trip_id']:
            continue

        # Variables base
        hora = np.random.randint(5, 21)
        clima = np.random.choice([0, 1]) 
        dia_semana = np.random.choice([0, 1])
        distancia = haversine(parada_actual['stop_lat'], parada_actual['stop_lon'],
                              parada_siguiente['stop_lat'], parada_siguiente['stop_lon'])

        # --- NUEVAS VARIABLES DE INFERENCIA VISUAL (FIFTYONE / COMPUTER VISION) ---
        # Origen de la cámara detectada
        tipo_camara = np.random.choice([0, 1, 2, 3]) # 0: Ninguna, 1: Incident_camera, 2: Onboard_bus, 3: Station_camera
        
        # Conteo de personas por IA en video: 0: Low, 1: Medium, 2: High, 3: Critical
        conteo_visual_pasajeros = np.random.choice([0, 1, 2, 3], p=[0.4, 0.3, 0.2, 0.1])
        
        # Clasificación de incidentes viales por imagen
        tipo_incidente = np.random.choice([0, 1, 2]) # 0: None, 1: Road_blockage, 2: Vehicle_breakdown
        intensidad_incidente = np.random.choice([0, 1, 2, 3]) # 0: Ninguna, 1: Baja, 2: Media, 3: Alta
        causes_delay = 1 if tipo_incidente > 0 and intensidad_incidente >= 2 else 0

        # --- LÓGICA DE IMPACTO EN EL ETA REAL ---
        tiempo_base = 5.0
        factor_hora = 2.0 if (6 <= hora <= 9) or (17 <= hora <= 20) else 1.0
        factor_clima = 1.3 if clima == 1 else 1.0
        
        # El incidente visual afecta drásticamente el ETA de la simulación
        retraso_incidente = 0.0
        if causes_delay == 1:
            # Road_blockage (bloqueo) penaliza más que un vehicle_breakdown (varado)
            base_retraso = 15.0 if tipo_incidente == 1 else 8.0
            retraso_incidente = base_retraso * intensidad_incidente
            
        eta_real = (tiempo_base * factor_hora * factor_clima) + retraso_incidente + np.random.normal(0, 1)
        eta_real = max(2.0, eta_real) # Evitar tiempos negativos

        # --- LÓGICA DE OCUPACIÓN ---
        # Si la cámara de a bordo (Onboard_bus) o de estación reporta congestión, influye directamente
        if conteo_visual_pasajeros == 3: # Critical
            ocupacion_final_idx = 2 # Alto
        elif conteo_visual_pasajeros == 2: # High
            ocupacion_final_idx = 2 if np.random.rand() > 0.3 else 1
        else:
            ocupacion_final_idx = np.random.choice([0, 1], p=[0.6, 0.4])

        data.append([
            parada_actual['stop_id'], parada_siguiente['stop_id'], hora, clima, dia_semana, distancia,
            tipo_camara, conteo_visual_pasajeros, tipo_incidente, intensidad_incidente, causes_delay,
            eta_real, ocupacion_final_idx
        ])

    columns = [
        'origen_id', 'destino_id', 'hora', 'clima', 'dia', 'distancia',
        'tipo_camara', 'conteo_visual', 'tipo_incidente', 'intensidad_incidente', 'causes_delay',
        'eta', 'ocupacion'
    ]
    return pd.DataFrame(data, columns=columns)

# Entrenar y guardar nuevos modelos entrenados con Visión
df = generar_dataset_vision()
X = df[['origen_id', 'destino_id', 'hora', 'clima', 'dia', 'distancia', 
        'tipo_camara', 'conteo_visual', 'tipo_incidente', 'intensidad_incidente', 'causes_delay']]

model_eta = RandomForestRegressor(n_estimators=100).fit(X, df['eta'])
model_ocup = RandomForestClassifier(n_estimators=100).fit(X, df['ocupacion'])

# ... (Al final del archivo, donde se entrenan los modelos) ...

# RUTAS DE GUARDADO DINÁMICAS
model_eta_path = os.path.join(base_path, 'models', 'model_p8_eta.pkl')
model_ocup_path = os.path.join(base_path, 'models', 'model_p8_ocup.pkl')

joblib.dump(model_eta, model_eta_path)
joblib.dump(model_ocup, model_ocup_path)
print("¡Modelos reentrenados exitosamente con variables de Visión Artificial!")