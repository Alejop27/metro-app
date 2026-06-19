import * as Location from 'expo-location';
import { Location as MyLocation } from '../types';

export const locationService = {
  /**
   * Request foreground location permission.
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Error requesting location permission:', error);
      return false;
    }
  },

  /**
   * Check if location permission is already granted.
   */
  checkPermission: async (): Promise<boolean> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      return false;
    }
  },

  /**
   * Get the current one-off user location.
   * Returns a fallback to Bucaramanga center if permissions are denied or in simulator.
   */
  getCurrentLocation: async (): Promise<MyLocation> => {
    try {
      const isGranted = await locationService.checkPermission();
      if (!isGranted) {
        const requestResult = await locationService.requestPermission();
        if (!requestResult) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      // Fallback coordinates for Bucaramanga, Colombia (provenza area)
      return {
        latitude: 7.0911,
        longitude: -73.1118,
        heading: 0,
        speed: 0,
        accuracy: 10,
        timestamp: Date.now(),
      };
    }
  },

  /**
   * Watch location changes.
   */
  watchLocation: async (callback: (location: MyLocation) => void): Promise<Location.LocationSubscription> => {
    const isGranted = await locationService.checkPermission();
    if (!isGranted) {
      await locationService.requestPermission();
    }

    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          heading: location.coords.heading,
          speed: location.coords.speed,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        });
      }
    );
  },
};
