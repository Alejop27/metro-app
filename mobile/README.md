# Metrolínea Smart - Mobile App 🚌 Sparkles

Base del proyecto móvil multiplataforma (Android & iOS) desarrollado en **React Native + Expo** con **TypeScript**, diseñado específicamente para la hackathon de movilidad urbana inteligente y optimización del sistema de transporte masivo **Metrolínea** en Bucaramanga.

La aplicación incluye seguimiento en tiempo real de vehículos, tiempos estimados de arribo (ETA), visualización geolocalizada interactiva de buses y estaciones, y módulos preparados para inteligencia artificial predictiva.

---

## 🛠️ Stack Tecnológico

- **Núcleo:** React Native + Expo (SDK 56)
- **Lenguaje:** TypeScript (Tipado Estricto)
- **Navegación:** React Navigation (Bottom Tabs + Stack Navigation)
- **Estilo y Diseño:** NativeWind (TailwindCSS en React Native) + CSS premium oscuro
- **Manejo de Estado:** Zustand (Almacén local con persistencia en Secure Store)
- **Consumo de APIs:** Axios (Patrón Repository)
- **Sincronización de Datos:** React Query (TanStack Query v5)
- **Mapas:** React Native Maps (con fallback interactivo optimizado para web)
- **Geolocalización:** Expo Location (suscripciones en tiempo real)
- **Seguridad:** Expo Secure Store
- **Formularios:** React Hook Form + Zod (validaciones robustas de reportes)

---

## 📐 Arquitectura del Proyecto

El proyecto sigue principios de **Clean Architecture**, **SOLID** y una organización **basada en carpetas de características (Feature-Based Structure)** para asegurar máxima mantenibilidad y escalabilidad.

```text
mobile/
├── src/
│   ├── api/          # Clientes HTTP configurados e interceptores de red
│   ├── assets/       # Imágenes, iconos del sistema y recursos estáticos
│   ├── components/   # Componentes visuales compartidos y modulares
│   │   ├── common/   # Modales compartidos y elementos menores
│   │   ├── maps/     # Mapa interactivo principal (Native & Web fallback)
│   │   ├── cards/    # BusCard, RouteCard, StationCard, AlertCard
│   │   └── ui/       # AppButton, AppInput, Header, LoadingView, EmptyState
│   ├── constants/    # Datos mock del sistema y coordenadas de geolocalización
│   ├── features/     # Componentes específicos y lógica agrupados por dominio
│   │   ├── auth/     # Autenticación y credenciales de usuario
│   │   ├── transport/# Controladores del mapa, buses y paradas
│   │   ├── routes/   # Lista de trayectos, colores y paradas ordenadas
│   │   ├── alerts/   # Feed de incidencias operativas y reportes ciudadanos
│   │   └── profile/  # Ajustes de cuenta y preferencias de favoritos
│   ├── hooks/        # Hooks personalizados (useRealTimeLocation, useTransportData, useAIModel)
│   ├── navigation/   # Rutas de navegación de la app (TabNavigator, AppNavigator)
│   ├── services/     # Clientes de servicios API estructurados en Repositorios
│   ├── store/        # Stores de Zustand (Auth, Location, Transport, Alerts)
│   ├── types/        # Modelos de dominio e interfaces TypeScript
│   └── utils/        # Funciones auxiliares y formateadores
├── App.tsx           # Punto de entrada de la aplicación (Proveedores globales)
├── app.json          # Configuración del empaquetador Expo
├── babel.config.js   # Configuraciones de compilación para NativeWind
├── tailwind.config.js# Paleta de colores accesibles y estilos visuales
└── tsconfig.json     # Configuración estricta del compilador TypeScript
```

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para poner en marcha el entorno local de desarrollo:

### 1. Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) en tu equipo.

### 2. Clonar e Instalar Dependencias
Accede a la carpeta raíz del proyecto móvil e instala todos los módulos requeridos:

```bash
cd mobile
npm install
```

### 3. Iniciar el Servidor de Desarrollo de Expo
Lanza el empaquetador metro de Expo:

```bash
npx expo start
```

### 4. Alternativas de Ejecución
Desde la consola interactiva de Expo o presionando las siguientes teclas:
- **`a`**: Abre la aplicación en un Emulador de **Android** configurado.
- **`i`**: Abre la aplicación en un Simulador de **iOS** (disponible solo en macOS).
- **`w`**: Abre la aplicación en el **Navegador Web** (corre instantáneamente gracias al sistema de mapeo de coordenadas SVG que simula el mapa de Bucaramanga de forma interactiva).

---

## 🧠 Preparación para Integración de IA

La arquitectura cuenta con hooks y servicios preparados estructuralmente bajo el patrón Repository para invocar modelos externos de Inteligencia Artificial mediante peticiones POST configuradas:

1. **Predicción de Tiempos de Llegada (ETA):**
   - **Endpoint:** `POST /api/predict-arrival`
   - **Estructura de Hook:** `predictArrival(busId, stationId, routeId)` en `useAIModel.ts`
   - **Simulación:** Retorna confianza de modelo (Confidence Score) calculando retrasos por clima y congestión histórica.

2. **Predicción de Congestión en Ruta:**
   - **Endpoint:** `POST /api/predict-congestion`
   - **Estructura de Hook:** `predictCongestion(routeId)` en `useAIModel.ts`
   - **Simulación:** Evalúa la velocidad media y sugiere rutas alternas si la ocupación del tramo vial es crítica.

3. **Recomendación Inteligente de Rutas:**
   - **Endpoint:** `POST /api/recommend-route`
   - **Estructura de Hook:** `recommendRoute(originId, destinationId)` en `useAIModel.ts`
   - **Simulación:** Propone combinaciones de trasbordos y calcula minutos exactos ahorrados al evadir cuellos de botella viales.

---

## 🎨 Características de Diseño UI Premium
- **Paleta de Colores Inspirada en Metrolínea:** Base en Azul Oscuro Premium (`#0B0F19`) combinado con Naranja Institucional de Metrolínea (`#FF5E13`) y Azul Eléctrico (`#0ea5e9`).
- **Simulación de Movimiento en Tiempo Real:** Los 20 buses circulan activamente por las coordenadas de Bucaramanga, deslizando sus posiciones en el mapa cada 3 segundos.
- **Formularios React Hook Form + Zod:** Formulario interactivo con validación instantánea para que los ciudadanos reporten congestiones o accidentes.
