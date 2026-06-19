# MetroTwin - Integración con FiftyOne 🚀

Este repositorio contiene la integración de **MetroTwin** (Sistema de Información y Monitoreo de Tránsito y Transporte) con **FiftyOne**, una herramienta de visualización y análisis de datasets para visión por computadora.

La solución incluye un pipeline automatizado para cargar y etiquetar imágenes sintéticas, la creación de vistas de interés analítico, y un **plugin personalizado desarrollado desde cero** para realizar análisis interactivo de ocupación.

---

## 📂 Estructura del Repositorio

- `setup_unificado.py`: Script principal que unifica la preparación del dataset, simulación de metadatos de dominio y el lanzamiento de la aplicación de FiftyOne.
- `fifthy_plugins/metrotwin-master/`: Carpeta del plugin personalizado de FiftyOne.
  - `fiftyone.yml`: Archivo de configuración que registra el plugin y sus operadores en FiftyOne.
  - `__init__.py`: Código fuente del plugin con la lógica del operador.
- `data/`: Carpeta de almacenamiento para imágenes y recursos del dataset (ej. `data/synthetic/visual`).

---

## 🛠️ Desarrollo del Plugin desde Cero

El plugin **`metrotwin_master`** y su operador **`run_analytics_engine`** fueron desarrollados completamente a medida para este proyecto.

### ¿Qué hace el plugin?
El plugin añade un operador interactivo a la interfaz de FiftyOne llamado **"MetroTwin: Refrescar Análisis de Ocupación"** (`run_analytics_engine`). Al ser ejecutado desde la interfaz (presionando `g` y buscando el operador o a través de la barra de acciones):
1. **Recorre** las muestras (samples) de la vista o dataset seleccionado.
2. **Analiza** el valor actual de `people_count`.
3. **Actualiza** el campo `crowd_level` dinámicamente usando las reglas de negocio del dominio:
   - `< 10` personas: `low`
   - `10 - 29` personas: `medium`
   - `30 - 49` personas: `high`
   - `>= 50` personas: `critical`
4. **Limpia** etiquetas de crowd obsoletas y añade la etiqueta correspondiente (`crowd_low`, `crowd_medium`, etc.).
5. **Guarda** los cambios persistiendo la nueva información en la base de datos de FiftyOne.

---

## 📊 Carga y Enriquecimiento de Datos en `setup_unificado.py`

El script realiza las siguientes operaciones automáticas:
1. **Configuración de Entorno**: Vincula la carpeta local `fifthy_plugins` con FiftyOne (`FIFTYONE_PLUGINS_DIR`).
2. **Limpieza Preventiva**: Para evitar conflictos y errores de carga del frontend (como el error común de `estimatedSampleCount` en vistas cacheadas), limpia y regenera el dataset `MetroTwin-Cameras`.
3. **Clasificación Inteligente**: Escanea y carga las 299 imágenes de `data/synthetic/visual`, deduciendo el origen y metadatos específicos según la estructura de carpetas:
   - Ruta contiene `autobus` ➡️ `source_type = onboard_bus` (Cámara a bordo de bus).
   - Ruta contiene `accidentes` o `trancones` ➡️ `source_type = incident_camera` (Cámara de incidentes de tráfico).
   - Cualquier otra ruta ➡️ `source_type = station_camera` (Cámara de estación).
4. **Metadatos de Dominio**:
   - Para cámaras de incidentes, simula: `incident_type` (accident, road_blockage, etc.), `incident_severity` (high, critical), tiempo estimado de retraso (`estimated_delay_min`), y score de riesgo (`delay_risk_score`). Añade además el tag `urgent_dispatch`.
   - Para todas las imágenes, simula conteos de personas (`people_count`) y calcula su nivel de ocupación inicial (`crowd_level`).
5. **Vistas Pre-guardadas (Saved Views)**:
   - **Riesgo Crítico de Retrasos (`Riesgo_Critico_Retrasos`)**: Muestra los incidentes con riesgo de retraso mayor a 0.8 ordenados de mayor a menor tiempo de demora.
   - **Aglomeraciones Críticas (`Aglomeraciones_Criticas`)**: Filtra las cámaras que registran ocupación crítica (`crowd_level == critical`).

---

## 🚀 Instrucciones de Uso

### 1. Requisitos Previos
Asegúrate de tener instalados los paquetes de Python necesarios:
```bash
pip install fiftyone
```

### 2. Ejecutar la Aplicación
Ejecuta el script unificado. Este preparará la base de datos, registrará el plugin local y abrirá la interfaz de FiftyOne:
```bash
python setup_unificado.py
```
FiftyOne se levantará por defecto en el puerto **`5151`** (accesible en `http://localhost:5151`).

### 3. Usar el Plugin en la Interfaz de FiftyOne
1. Abre la interfaz web en tu navegador.
2. Presiona la tecla **`g`** para abrir la paleta de comandos rápidos de FiftyOne.
3. Escribe **"MetroTwin: Refrescar Análisis de Ocupación"** y selecciónalo.
4. Confirma la acción para recalcular dinámicamente los niveles de aglomeración y tags.
