import { create } from 'zustand';
import { Bus, Route, Station, ETA } from '../types';
import { MOCK_BUSES, MOCK_ROUTES, MOCK_STATIONS } from '../constants/mockData';
import { RouteSuggestionResponse } from '../services/api';

interface TransportState {
  buses: Bus[];
  routes: Route[];
  stations: Station[];
  selectedBusId: string | null;
  selectedRouteId: string | null;
  selectedStationId: string | null;
  suggestedRoute: RouteSuggestionResponse['data'] | null;
  etas: ETA[];
  isLoading: boolean;
  
  // Setters
  setBuses: (buses: Bus[]) => void;
  setRoutes: (routes: Route[]) => void;
  setStations: (stations: Station[]) => void;
  setSuggestedRoute: (route: RouteSuggestionResponse['data'] | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Selection
  selectBus: (busId: string | null) => void;
  selectRoute: (routeId: string | null) => void;
  selectStation: (stationId: string | null) => void;
  
  // Real-time simulations
  updateBusLocations: (updater: (prevBuses: Bus[]) => Bus[]) => void;
  calculateETAs: () => void;
}

export const useTransportStore = create<TransportState>((set, get) => ({
  buses: MOCK_BUSES,
  routes: MOCK_ROUTES,
  stations: MOCK_STATIONS,
  selectedBusId: null,
  selectedRouteId: null,
  selectedStationId: null,
  suggestedRoute: null,
  etas: [],
  isLoading: false,

  setBuses: (buses) => set({ buses }),
  setRoutes: (routes) => set({ routes }),
  setStations: (stations) => set({ stations }),
  setSuggestedRoute: (suggestedRoute) => set({ suggestedRoute }),
  setLoading: (isLoading) => set({ isLoading }),

  selectBus: (busId) => {
    set({ selectedBusId: busId });
    if (busId) {
      const bus = get().buses.find(b => b.id === busId);
      if (bus) {
        set({ selectedRouteId: bus.routeId });
      }
    }
    get().calculateETAs();
  },

  selectRoute: (routeId) => {
    set({ selectedRouteId: routeId });
    // Clear selected bus if it doesn't belong to the new route
    const busId = get().selectedBusId;
    if (busId) {
      const bus = get().buses.find(b => b.id === busId);
      if (bus && bus.routeId !== routeId) {
        set({ selectedBusId: null });
      }
    }
    get().calculateETAs();
  },

  selectStation: (stationId) => {
    set({ selectedStationId: stationId });
    get().calculateETAs();
  },

  updateBusLocations: (updater) => {
    set((state) => ({ buses: updater(state.buses) }));
    get().calculateETAs();
  },

  calculateETAs: () => {
    const { buses, routes, stations, selectedRouteId, selectedStationId } = get();
    if (!selectedRouteId) {
      set({ etas: [] });
      return;
    }

    const route = routes.find(r => r.id === selectedRouteId);
    if (!route) {
      set({ etas: [] });
      return;
    }

    // Get all buses on this route
    const routeBuses = buses.filter(b => b.routeId === selectedRouteId && b.status === 'OPERATIONAL');
    if (routeBuses.length === 0) {
      set({ etas: [] });
      return;
    }

    const newEtas: ETA[] = [];

    // Calculate ETA for each station on the route
    route.stations.forEach((stationId, stationIndex) => {
      const station = stations.find(s => s.id === stationId);
      if (!station) return;

      // Find the nearest bus approaching this station
      // For Metrolínea simulation, let's look at buses that have a route heading towards this station
      let bestEtaMinutes = 999;
      let bestDistance = 99999;
      let bestStopsRemaining = 99;
      let associatedBusId = '';

      routeBuses.forEach(bus => {
        // Mock math: distance between bus and station
        const dLat = station.latitude - bus.latitude;
        const dLng = station.longitude - bus.longitude;
        // Approx distance in kilometers
        const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111.12;

        // Since it's a closed route, let's create a realistic stop calculation
        // If bus speed is 0 (due to traffic/delay), increase time
        const baseSpeed = bus.speed > 0 ? bus.speed : 15; // km/h
        const travelTimeMinutes = (distanceKm / baseSpeed) * 60;
        
        // Stops remaining: mock index based calculation
        // Find bus nearest station and estimate
        const mockStops = Math.max(1, Math.round(distanceKm / 1.2));
        const stopTimeMinutes = mockStops * 1.0; // 1 min per stop
        
        const totalMinutes = Math.round(travelTimeMinutes + stopTimeMinutes);

        // Keep the closest approaching bus
        if (totalMinutes < bestEtaMinutes) {
          bestEtaMinutes = totalMinutes;
          bestDistance = Math.round(distanceKm * 1000); // meters
          bestStopsRemaining = mockStops;
          associatedBusId = bus.id;
        }
      });

      if (associatedBusId) {
        newEtas.push({
          busId: associatedBusId,
          routeId: selectedRouteId,
          stationId,
          etaMinutes: Math.max(1, bestEtaMinutes),
          distanceMeters: bestDistance,
          remainingStops: bestStopsRemaining
        });
      }
    });

    set({ etas: newEtas });
  }
}));
