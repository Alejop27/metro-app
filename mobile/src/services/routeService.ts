import apiClient from './apiClient';
import { Route, RouteRecommendation } from '../types';
import { MOCK_ROUTES } from '../constants/mockData';

const USE_MOCK = true;

export const routeService = {
  /**
   * Fetch all routes
   */
  getRoutes: async (): Promise<Route[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return MOCK_ROUTES;
    }

    const response = await apiClient.get<Route[]>('/routes');
    return response.data;
  },

  /**
   * Future AI-powered route recommendation based on real-time delays.
   * POST /api/recommend-route
   */
  recommendRoute: async (
    originStationId: string,
    destinationStationId: string
  ): Promise<RouteRecommendation> => {
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock recommending T1 as main route, and RE1 as fast alternative saving 8 mins
        return {
          recommendedRouteId: 'rt_t1',
          alternativeRouteIds: ['rt_re1', 'rt_p3'],
          reasoning: 'La autopista presenta alta congestión vehicular. Se recomienda tomar el servicio expreso RE1 para evitar el tramo Cañaveral-Provenza.',
          estimatedTimeSavingMinutes: 8
        };
      }

      const response = await apiClient.post<RouteRecommendation>('/recommend-route', {
        originStationId,
        destinationStationId
      });
      return response.data;
    } catch (error) {
      console.error('Error in recommend-route AI service:', error);
      throw error;
    }
  }
};
