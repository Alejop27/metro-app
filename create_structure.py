import os

folders = [

    "app",

    "app/config",

    "app/controllers",

    "app/services",

    "app/repositories",

    "app/models",

    "app/schemas",

    "app/routers",

    "app/utils",

    "app/middleware",

    "app/data",

    "tests"

]

files = [

    "app/main.py",

    "app/config/firebase_config.py",

    "app/config/settings.py",

    "app/controllers/chat_controller.py",

    "app/controllers/route_controller.py",

    "app/controllers/prediction_controller.py",

    "app/controllers/gps_controller.py",

    "app/controllers/heatmap_controller.py",

    "app/services/chat_service.py",

    "app/services/route_service.py",

    "app/services/prediction_service.py",

    "app/services/gps_service.py",

    "app/services/heatmap_service.py",

    "app/repositories/chat_repository.py",

    "app/repositories/route_repository.py",

    "app/repositories/prediction_repository.py",

    "app/repositories/gps_repository.py",

    "app/repositories/station_repository.py",

    "app/models/bus.py",

    "app/models/station.py",

    "app/models/route.py",

    "app/models/prediction.py",

    "app/schemas/chat_schema.py",

    "app/schemas/prediction_schema.py",

    "app/schemas/route_schema.py",

    "app/schemas/station_schema.py",

    "app/routers/chat_router.py",

    "app/routers/prediction_router.py",

    "app/routers/route_router.py",

    "app/routers/gps_router.py",

    "app/routers/heatmap_router.py",

    "app/utils/simulator.py",

    "app/utils/occupancy.py",

    "app/utils/logger.py",

    "app/middleware/exception_handler.py",

    "app/data/routes.csv",

    "app/data/stations.csv",

    "app/data/buses.csv",

    ".env",

    "firebase.json",

    "requirements.txt",

    "README.md",

    "run.py"

]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

for file in files:

    if not os.path.exists(file):
        open(file, "w").close()

print("Proyecto MetroIA creado correctamente.")