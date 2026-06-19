export interface Location {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  favoriteRoutes: string[]; // Route IDs
  favoriteStations: string[]; // Station IDs
  tripHistory: Trip[];
}

export interface Trip {
  id: string;
  routeId: string;
  routeName: string;
  date: string;
  durationMinutes: number;
  distanceKm: number;
  cost: number;
}

export type OccupancyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';

export type BusStatus = 'OPERATIONAL' | 'DELAYED' | 'OUT_OF_SERVICE' | 'ACCIDENT';

export interface Bus {
  id: string;
  routeId: string;
  routeName: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number; // km/h
  occupancy: OccupancyLevel;
  status: BusStatus;
  lastUpdated: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  color: string;
  stations: string[]; // Station IDs in order
  isActive: boolean;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  code: string;
  status: 'ACTIVE' | 'TEMPORARILY_CLOSED' | 'MAINTENANCE';
}

export type AlertType = 'CONGESTION' | 'DELAY' | 'ACCIDENT' | 'ROUTE_CHANGE' | 'SUSPENSION';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  routeId?: string;
  busId?: string;
  stationId?: string;
  timestamp: string;
  active: boolean;
}

export interface ETA {
  busId: string;
  routeId: string;
  stationId: string;
  etaMinutes: number;
  distanceMeters: number;
  remainingStops: number;
}

export interface PredictionRequest {
  busId?: string;
  routeId?: string;
  stationId?: string;
  timeOfDay?: string;
  dayOfWeek?: string;
}

export interface ArrivalPrediction {
  etaMinutes: number;
  confidenceScore: number; // 0.0 to 1.0
  factors: string[];
}

export interface CongestionPrediction {
  routeId: string;
  congestionLevel: OccupancyLevel;
  confidenceScore: number;
  alternativeRouteRecommended?: string;
}

export interface RouteRecommendation {
  recommendedRouteId: string;
  alternativeRouteIds: string[];
  reasoning: string;
  estimatedTimeSavingMinutes: number;
}
