import apiClient from './apiClient';
import { Bus, Station, PredictionRequest, ArrivalPrediction, CongestionPrediction, OccupancyLevel } from '../types';
import { MOCK_BUSES, MOCK_STATIONS } from '../constants/mockData';

// Enable mock mode by default for Hackathon, switchable via environment config
const USE_MOCK = true;

export const transportService = {
  /**
   * Get list of all operational and delayed buses.
   */
  getBuses: async (): Promise<Bus[]> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_BUSES;
    }
    
    const response = await apiClient.get<Bus[]>('/transport/buses');
    return response.data;
  },

  /**
   * Get list of all physical Metrolínea stations.
   */
  getStations: async (): Promise<Station[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_STATIONS;
    }

    const response = await apiClient.get<Station[]>('/transport/stations');
    return response.data;
  },

  /**
   * Future AI-powered arrival prediction model endpoint.
   * POST /api/predict-arrival
   */
  predictArrival: async (request: PredictionRequest): Promise<ArrivalPrediction> => {
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Mock prediction algorithm based on simple heuristics
        const mockConfidence = 0.85 + Math.random() * 0.12;
        const mockEta = Math.floor(5 + Math.random() * 20);
        return {
          etaMinutes: mockEta,
          confidenceScore: parseFloat(mockConfidence.toFixed(2)),
          factors: [
            'Tráfico histórico de las 12:00 PM',
            'Velocidad media actual de la troncal: 32km/h',
            'Clima: Despejado'
          ]
        };
      }

      const response = await apiClient.post<ArrivalPrediction>('/predict-arrival', request);
      return response.data;
    } catch (error) {
      console.error('Error invoking predict-arrival AI service:', error);
      throw error;
    }
  },

  /**
   * Future AI-powered congestion prediction model endpoint.
   * POST /api/predict-congestion
   */
  predictCongestion: async (routeId: string): Promise<CongestionPrediction> => {
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Heuristics: T1 and T3 are usually high congestion in rush hours
        const congestionLevels: OccupancyLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'FULL'];
        const mockLevel = routeId === 'rt_t1' || routeId === 'rt_t3' ? 'HIGH' : 'MEDIUM';
        
        return {
          routeId,
          congestionLevel: mockLevel,
          confidenceScore: 0.92,
          alternativeRouteRecommended: routeId === 'rt_t1' ? 'rt_re1' : undefined
        };
      }

      const response = await apiClient.post<CongestionPrediction>('/predict-congestion', { routeId });
      return response.data;
    } catch (error) {
      console.error('Error invoking predict-congestion AI service:', error);
      throw error;
    }
  }
};
