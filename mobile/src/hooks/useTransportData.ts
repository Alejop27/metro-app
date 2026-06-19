import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTransportStore } from '../store/transportStore';
import { transportService } from '../services/transportService';
import { routeService } from '../services/routeService';
import { alertService } from '../services/alertService';
import { Bus } from '../types';

export const useTransportData = () => {
  const {
    buses,
    routes,
    stations,
    selectedRouteId,
    selectedBusId,
    etas,
    setBuses,
    setRoutes,
    setStations,
    updateBusLocations,
    calculateETAs,
  } = useTransportStore();

  // React Query for initial data loading and cache management
  const { data: queryBuses, isLoading: isLoadingBuses } = useQuery({
    queryKey: ['buses'],
    queryFn: transportService.getBuses,
    refetchInterval: 15000, // Sync with backend every 15s
  });

  const { data: queryRoutes, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ['routes'],
    queryFn: routeService.getRoutes,
    staleTime: 60000,
  });

  const { data: queryStations, isLoading: isLoadingStations } = useQuery({
    queryKey: ['stations'],
    queryFn: transportService.getStations,
    staleTime: 60000,
  });

  // Sync React Query cache with Zustand global state
  useEffect(() => {
    if (queryBuses) setBuses(queryBuses);
  }, [queryBuses, setBuses]);

  useEffect(() => {
    if (queryRoutes) setRoutes(queryRoutes);
  }, [queryRoutes, setRoutes]);

  useEffect(() => {
    if (queryStations) setStations(queryStations);
  }, [queryStations, setStations]);

  // Real-time bus movement simulation
  // This simulates the bus moving along its course in between API refreshes
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      updateBusLocations((prevBuses) => {
        return prevBuses.map((bus) => {
          if (bus.status !== 'OPERATIONAL' || bus.speed === 0) return bus;

          // Conversion: 1 degree latitude ~ 111,120 meters
          // Bus speed in km/h -> meters/second -> degrees/second
          // We run simulation update every 3 seconds
          const speedMps = (bus.speed * 1000) / 3600; // m/s
          const distanceMoved = speedMps * 3; // meters moved in 3 seconds
          const degreesChange = distanceMoved / 111120; // coordinate change

          const headingRad = (bus.heading * Math.PI) / 180;
          
          // Calculate new coordinates based on heading
          let newLat = bus.latitude + Math.cos(headingRad) * degreesChange;
          let newLng = bus.longitude + Math.sin(headingRad) * degreesChange;

          // Simple bounce back logic if bus travels too far outside Bucaramanga bounds
          // Keeps buses circulating in the demo area
          let newHeading = bus.heading;
          if (newLat > 7.150 || newLat < 6.980) {
            newHeading = (bus.heading + 180) % 360;
          }
          if (newLng > -73.040 || newLng < -73.150) {
            newHeading = (bus.heading + 180) % 360;
          }

          return {
            ...bus,
            latitude: parseFloat(newLat.toFixed(5)),
            longitude: parseFloat(newLng.toFixed(5)),
            heading: newHeading,
            lastUpdated: new Date().toISOString(),
          };
        });
      });
    }, 3000);

    return () => clearInterval(simulationInterval);
  }, [updateBusLocations]);

  // Recalculate ETAs whenever buses, selection, or stations change
  useEffect(() => {
    calculateETAs();
  }, [buses, selectedRouteId, selectedBusId, calculateETAs]);

  return {
    buses,
    routes,
    stations,
    etas,
    isLoading: isLoadingBuses || isLoadingRoutes || isLoadingStations,
  };
};
export default useTransportData;
