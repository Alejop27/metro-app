import { useEffect, useRef } from 'react';
import { useLocationStore } from '../store/locationStore';
import { locationService } from '../services/locationService';
import * as Location from 'expo-location';

export const useRealTimeLocation = () => {
  const {
    currentLocation,
    permissionGranted,
    isTracking,
    updateLocation,
    setPermissionGranted,
    setIsTracking,
  } = useLocationStore();

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      const hasPermission = await locationService.checkPermission();
      setPermissionGranted(hasPermission);

      if (hasPermission) {
        // Fetch initial location
        const loc = await locationService.getCurrentLocation();
        updateLocation(loc);
      } else {
        const granted = await locationService.requestPermission();
        setPermissionGranted(granted);
        if (granted) {
          const loc = await locationService.getCurrentLocation();
          updateLocation(loc);
        }
      }
    };

    initLocation();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const startTracking = async () => {
    if (subscriptionRef.current) return;

    try {
      const isGranted = await locationService.checkPermission();
      if (!isGranted) {
        const req = await locationService.requestPermission();
        setPermissionGranted(req);
        if (!req) return;
      }

      setIsTracking(true);
      
      // Get one immediate location
      const initialLoc = await locationService.getCurrentLocation();
      updateLocation(initialLoc);

      // Subscribe to updates
      subscriptionRef.current = await locationService.watchLocation((loc) => {
        updateLocation(loc);
      });
    } catch (e) {
      console.warn('Error starting location tracking:', e);
      setIsTracking(false);
    }
  };

  const stopTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsTracking(false);
  };

  return {
    currentLocation,
    permissionGranted,
    isTracking,
    startTracking,
    stopTracking,
  };
};
