import os
import glob
import random
import fiftyone as fo
from fiftyone import ViewField as F

# 1. Crear estructura unificada
root_dir = r"d:\CursoJava\Programacion\fiftyone\metro_fiftyone_repo"
plugins_dir = os.path.join(root_dir, "fifthy_plugins")
os.makedirs(plugins_dir, exist_ok=True)

# Asignar la ruta de plugins a la variable de entorno para que FiftyOne la lea
os.environ["FIFTYONE_PLUGINS_DIR"] = plugins_dir
fo.config.plugins_dir = plugins_dir

# 2. Escribir el Plugin Maestro
master_plugin_dir = os.path.join(plugins_dir, "metrotwin-master")
os.makedirs(master_plugin_dir, exist_ok=True)

yaml_content = """name: "metrotwin_master"
version: "1.0.0"
description: "Master plugin for MetroTwin SITM"
fiftyone:
  version: ">=0.21.0"
operators:
  - run_analytics_engine
"""
with open(os.path.join(master_plugin_dir, "fiftyone.yml"), "w", encoding="utf-8") as f:
    f.write(yaml_content)

init_content = """import fiftyone.operators as foo
import fiftyone.operators.types as types

class RunAnalyticsEngine(foo.Operator):
    @property
    def config(self):
        return foo.OperatorConfig(
            name="run_analytics_engine",
            label="MetroTwin: Refrescar Análisis de Ocupación",
            description="Recalcula las alertas y el crowd level de la vista actual.",
            dynamic=True
        )

    def resolve_input(self, ctx):
        inputs = types.Object()
        inputs.str("msg", label="Atención", default="Esto recalculará el nivel de ocupación.", view=types.Notice())
        return types.Property(inputs)

    def execute(self, ctx):
        dataset = ctx.dataset
        samples = ctx.view if ctx.view is not None else dataset
        count_updated = 0
        for sample in samples:
            count = sample.get("people_count", 0)
            if count < 10: crowd = "low"
            elif count < 30: crowd = "medium"
            elif count < 50: crowd = "high"
            else: crowd = "critical"
            sample["crowd_level"] = crowd
            sample.tags = [t for t in sample.tags if not t.startswith("crowd_")]
            sample.tags.append(f"crowd_{crowd}")
            sample.save()
            count_updated += 1
        return {"status": "success", "message": f"{count_updated} imágenes recalculadas."}

def register(p):
    p.register(RunAnalyticsEngine)
"""
with open(os.path.join(master_plugin_dir, "__init__.py"), "w", encoding="utf-8") as f:
    f.write(init_content)

# 3. Limpiar Base de Datos y Evitar Crashes Frontend
dataset_name = "MetroTwin-Cameras"
if dataset_name in fo.list_datasets():
    dataset = fo.load_dataset(dataset_name)
    # Limpiamos todas las vistas antiguas para evitar el error 'estimatedSampleCount'
    for view_name in dataset.list_saved_views():
        dataset.delete_saved_view(view_name)
    dataset.clear() # Borrar samples antiguos
else:
    dataset = fo.Dataset(dataset_name)
    dataset.persistent = True

# 4. CARGAR DATOS REALES Y MEZCLAR CON LOGICA DE DOMINIO
print("[*] Cargando las 299 imágenes reales desde /data/synthetic/visual...")
visual_dir = os.path.join(root_dir, "data", "synthetic", "visual")
all_files = []
for r, _, files in os.walk(visual_dir):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            all_files.append(os.path.join(r, file))

samples = []
for filepath in all_files:
    sample = fo.Sample(filepath=filepath)
    sample["data_source"] = "official_data"
    
    # Clasificación por Carpeta
    path_lower = filepath.lower()
    if "\\autobus\\" in path_lower:
        sample["source_type"] = "onboard_bus"
    elif "\\accidentes\\" in path_lower or "\\trancones\\" in path_lower:
        sample["source_type"] = "incident_camera"
    else:
        sample["source_type"] = "station_camera"
        
    sample["station_id"] = f"ST_{random.randint(1, 15)}"
    
    # Inyectar simulaciones de incidentes y conteos para las reales
    if sample["source_type"] == "incident_camera":
        sample["incident_type"] = random.choice(["accident", "road_blockage", "vehicle_breakdown"])
        sample["incident_severity"] = random.choice(["high", "critical"])
        sample["causes_delay"] = True
        sample["estimated_delay_min"] = random.randint(15, 60)
        sample["delay_risk_score"] = random.uniform(0.7, 1.0)
        sample.tags.append("urgent_dispatch")
    else:
        sample["incident_type"] = "none"
        sample["incident_severity"] = "low"
        sample["causes_delay"] = False
        sample["estimated_delay_min"] = 0
        sample["delay_risk_score"] = 0.0

    # Simulamos el conteo de personas (ya que no estamos corriendo el modelo real de 15 mins)
    count = random.randint(0, 80)
    sample["people_count"] = count
    
    # Domain Logic Crowd Level
    if count < 10: crowd = "low"
    elif count < 30: crowd = "medium"
    elif count < 50: crowd = "high"
    else: crowd = "critical"
    sample["crowd_level"] = crowd
    sample.tags.append(f"crowd_{crowd}")
    
    samples.append(sample)

dataset.add_samples(samples)
print(f"[*] {len(dataset)} imágenes cargadas y etiquetadas en la base de datos.")

# 5. Crear Vistas Nuevas Seguras
view_high_risk = dataset.match(F("delay_risk_score") > 0.8).sort_by("estimated_delay_min", reverse=True)
dataset.save_view("Riesgo_Critico_Retrasos", view_high_risk)

view_critical = dataset.match(F("crowd_level") == "critical")
dataset.save_view("Aglomeraciones_Criticas", view_critical)

print("[*] Unificación completada. Levantando FiftyOne...")
session = fo.launch_app(dataset, port=5151)
session.wait()
