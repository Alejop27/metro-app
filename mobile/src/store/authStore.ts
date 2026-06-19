import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, Trip } from '../types';
import { MOCK_USER } from '../constants/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loginMock: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavoriteRoute: (routeId: string) => void;
  toggleFavoriteStation: (stationId: string) => void;
  addTripToHistory: (trip: Omit<Trip, 'id'>) => void;
}

const TOKEN_KEY = 'metro_auth_token';
const USER_KEY = 'metro_user_data';

export const useAuthStore = create<AuthState>((set) => {
  // Try to load initial state from SecureStore asynchronously
  const initializeStore = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isLoading: false
        });
      } else {
        // Use Mock User by default for the Hackathon experience
        await SecureStore.setItemAsync(TOKEN_KEY, 'mock-jwt-token-xyz');
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(MOCK_USER));
        set({
          token: 'mock-jwt-token-xyz',
          user: MOCK_USER,
          isLoading: false
        });
      }
    } catch (e) {
      // Fallback if secure store fails (e.g. in web environment or simulator)
      set({
        token: 'mock-jwt-token-xyz',
        user: MOCK_USER,
        isLoading: false
      });
    }
  };

  // Run initialization
  initializeStore();

  return {
    user: null,
    token: null,
    isLoading: true,
    error: null,

    loginMock: async () => {
      set({ isLoading: true, error: null });
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, 'mock-jwt-token-xyz');
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(MOCK_USER));
        set({ user: MOCK_USER, token: 'mock-jwt-token-xyz', isLoading: false });
      } catch (e) {
        set({ user: MOCK_USER, token: 'mock-jwt-token-xyz', isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        set({ user: null, token: null, isLoading: false });
      } catch (e) {
        set({ user: null, token: null, isLoading: false });
      }
    },

    toggleFavoriteRoute: (routeId: string) => {
      set((state) => {
        if (!state.user) return state;
        const isFav = state.user.favoriteRoutes.includes(routeId);
        const updatedFavs = isFav
          ? state.user.favoriteRoutes.filter((id) => id !== routeId)
          : [...state.user.favoriteRoutes, routeId];

        const updatedUser = { ...state.user, favoriteRoutes: updatedFavs };
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
        return { user: updatedUser };
      });
    },

    toggleFavoriteStation: (stationId: string) => {
      set((state) => {
        if (!state.user) return state;
        const isFav = state.user.favoriteStations.includes(stationId);
        const updatedFavs = isFav
          ? state.user.favoriteStations.filter((id) => id !== stationId)
          : [...state.user.favoriteStations, stationId];

        const updatedUser = { ...state.user, favoriteStations: updatedFavs };
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
        return { user: updatedUser };
      });
    },

    addTripToHistory: (tripData: Omit<Trip, 'id'>) => {
      set((state) => {
        if (!state.user) return state;
        const newTrip: Trip = {
          ...tripData,
          id: `tp_${Date.now()}`
        };
        const updatedHistory = [newTrip, ...state.user.tripHistory];
        const updatedUser = { ...state.user, tripHistory: updatedHistory };
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
        return { user: updatedUser };
      });
    }
  };
});
