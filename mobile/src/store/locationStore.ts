import { create } from 'zustand';
import { Location } from '../types';

interface LocationState {
  currentLocation: Location | null;
  permissionGranted: boolean | null;
  isTracking: boolean;
  updateLocation: (location: Location) => void;
  setPermissionGranted: (granted: boolean) => void;
  setIsTracking: (tracking: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  permissionGranted: null,
  isTracking: false,

  updateLocation: (location: Location) => {
    set({ currentLocation: location });
  },

  setPermissionGranted: (granted: boolean) => {
    set({ permissionGranted: granted });
  },

  setIsTracking: (tracking: boolean) => {
    set({ isTracking: tracking });
  },
}));
