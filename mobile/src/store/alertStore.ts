import { create } from 'zustand';
import { Alert, AlertType, AlertSeverity } from '../types';
import { MOCK_ALERTS } from '../constants/mockData';

interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
  
  // Actions
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'active'>) => void;
  resolveAlert: (alertId: string) => void;
  getAlertsByRoute: (routeId: string) => Alert[];
  getAlertsByStation: (stationId: string) => Alert[];
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: MOCK_ALERTS,
  isLoading: false,

  setAlerts: (alerts) => set({ alerts }),

  addAlert: (alertData) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      active: true
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts]
    }));
  },

  resolveAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, active: false } : alert
      )
    }));
  },

  getAlertsByRoute: (routeId) => {
    return get().alerts.filter((alert) => alert.active && alert.routeId === routeId);
  },

  getAlertsByStation: (stationId) => {
    return get().alerts.filter((alert) => alert.active && alert.stationId === stationId);
  }
}));
