import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RouteSuggestionRequest {
  user_lat: number;
  user_lon: number;
  destino_id: string; // Used string to match frontend mock data, though the example has int 11
}

export interface LiveBus {
  bus_id: string;
  ruta: string;
  sentido: string;
  lat_actual: number;
  lon_actual: number;
  proxima_parada_id: number;
  nombre_proxima_parada: string;
  velocidad_aprox_kmh: number;
}

export interface LiveBusesResponse {
  success: boolean;
  message: string;
  data: LiveBus[];
}

export interface RouteSuggestionResponse {
  success: boolean;
  message: string;
  data: {
    usuario_ubicado: boolean;
    parada_mas_cercana: {
      id: string;
      name: string;
      lat: number;
      lon: number;
    };
    estacion_destino: {
      id: string;
      name: string;
      lat: number;
      lon: number;
    };
    distancia_total_km: number;
    eta_minutos: number;
    ocupacion_nivel: string;
    bus_id_asignado: string;
    analitica_camaras: {
      camara_origen: string;
      conteo_pasajeros: string;
      incidente_detectado: string;
      intensidad: string;
      genera_retraso: boolean;
      retraso_estimado_minutos: number;
    };
    buses_en_ruta: Array<{
      bus_id: string;
      ruta: string;
      sentido: string;
      lat_actual: number;
      lon_actual: number;
      proxima_parada_id: string | number;
      nombre_proxima_parada: string;
      velocidad_aprox_kmh: number;
    }>;
    servidor_info: {
      hora_procesada: string;
      clima_detectado: string;
      tipo_dia: string;
    };
  };
}

export const TransportAPI = {
  getRouteSuggestion: async (data: RouteSuggestionRequest): Promise<RouteSuggestionResponse> => {
    try {
      // Real API Call:
      const response = await apiClient.post<RouteSuggestionResponse>('/prediction/smart-live', data);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock response...');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Procesado por el servidor con IA (MOCK)",
            data: {
              usuario_ubicado: true,
              parada_mas_cercana: {
                id: "st_12",
                name: "Centro Comercial La Florida",
                lat: 7.070759362253019,
                lon: -73.10537239455138
              },
              estacion_destino: {
                id: data.destino_id,
                name: "Estación De Transferencia Provenza",
                lat: 7.09095589786415,
                lon: -73.10914317332427
              },
              distancia_total_km: 1.41,
              eta_minutos: 6.4,
              ocupacion_nivel: "Bajo",
              bus_id_asignado: "BUS-P8-01",
              analitica_camaras: {
                camara_origen: "Onboard_bus",
                conteo_pasajeros: "Medium",
                incidente_detectado: "Ninguno",
                intensidad: "Ninguna",
                genera_retraso: false,
                retraso_estimado_minutos: 0
              },
              buses_en_ruta: [
                {
                  bus_id: "BUS-P8-01",
                  ruta: "P8",
                  sentido: "OUT",
                  lat_actual: 7.132245,
                  lon_actual: -73.112638,
                  proxima_parada_id: 7,
                  nombre_proxima_parada: "Universidad Cooperativa De Colombia",
                  velocidad_aprox_kmh: 24.5
                },
                {
                  bus_id: "BUS-P8-02",
                  ruta: "P8",
                  sentido: "OUT",
                  lat_actual: 7.07977,
                  lon_actual: -73.113089,
                  proxima_parada_id: 12,
                  nombre_proxima_parada: "Centro Comercial La Florida",
                  velocidad_aprox_kmh: 24.5
                },
                {
                  bus_id: "BUS-P8-03",
                  ruta: "P8",
                  sentido: "OUT",
                  lat_actual: 7.085277,
                  lon_actual: -73.131263,
                  proxima_parada_id: 16,
                  nombre_proxima_parada: "Br. Hoyo Grande",
                  velocidad_aprox_kmh: 24.5
                }
              ],
              servidor_info: {
                hora_procesada: "15:00",
                clima_detectado: "Lluvia",
                tipo_dia: "Lunes-Viernes"
              }
            }
          });
        }, 800);
      });
    }
  },

  getLiveBuses: async (): Promise<LiveBusesResponse> => {
    try {
      const response = await apiClient.get<LiveBusesResponse>('/prediction/buses-streaming');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock live buses...');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Flota P8 localizada (MOCK)",
            data: [
              {
                bus_id: "BUS-P8-01",
                ruta: "P8",
                sentido: "OUT",
                lat_actual: 7.121881,
                lon_actual: -73.107123,
                proxima_parada_id: 12,
                nombre_proxima_parada: "Centro Comercial La Florida",
                velocidad_aprox_kmh: 28
              },
              {
                bus_id: "BUS-P8-02",
                ruta: "P8",
                sentido: "OUT",
                lat_actual: 7.085277,
                lon_actual: -73.131263,
                proxima_parada_id: 16,
                nombre_proxima_parada: "Br. Hoyo Grande",
                velocidad_aprox_kmh: 28
              },
              {
                bus_id: "BUS-P8-03",
                ruta: "P8",
                sentido: "OUT",
                lat_actual: 7.132491,
                lon_actual: -73.113513,
                proxima_parada_id: 6,
                nombre_proxima_parada: "Quinta Brigada Del Ejército (Kr 33a - Cl 17)",
                velocidad_aprox_kmh: 28
              }
            ]
          });
        }, 500);
      });
    }
  }
};
