import apiClient from './apiClient';
import { Alert } from '../types';
import { MOCK_ALERTS } from '../constants/mockData';

const USE_MOCK = true;

export const alertService = {
  /**
   * Fetch all active system alerts
   */
  getAlerts: async (): Promise<Alert[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_ALERTS;
    }

    const response = await apiClient.get<Alert[]>('/alerts');
    return response.data;
  },

  /**
   * Submit a new citizen alert
   */
  createAlert: async (alertData: Omit<Alert, 'id' | 'timestamp' | 'active'>): Promise<Alert> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockResult: Alert = {
        ...alertData,
        id: `alt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        active: true
      };
      return mockResult;
    }

    const response = await apiClient.post<Alert>('/alerts', alertData);
    return response.data;
  }
};
