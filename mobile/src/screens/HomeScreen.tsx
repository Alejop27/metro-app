import React, { useState, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { SearchBar } from '../components/map/SearchBar';
import { NearestBusCard } from '../components/map/NearestBusCard';
import { MapControls } from '../components/map/MapControls';
import { useTransportData } from '../hooks/useTransportData';
import { useRealTimeLocation } from '../hooks/useRealTimeLocation';
import { useTransportStore } from '../store/transportStore';
import { useAuthStore } from '../store/authStore';
import { Settings, ArrowLeft } from 'lucide-react-native';
import { TransportAPI, RouteSuggestionResponse } from '../services/api';

export const HomeScreen: React.FC = () => {
  const { buses, stations, routes, etas } = useTransportData();
  const { currentLocation, startTracking } = useRealTimeLocation();
  const { user } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<any>(null);

  const {
    selectedBusId,
    selectedRouteId,
    selectedStationId,
    suggestedRoute,
    selectBus,
    selectStation,
    selectRoute,
    setSuggestedRoute,
  } = useTransportStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingRoute, setIsSearchingRoute] = useState(false);
  const [showBuses, setShowBuses] = useState(true);
  const [showStations, setShowStations] = useState(true);

  // Find nearest operational bus (closest to user if available, else first)
  const nearestBus = buses.find(b => b.status === 'OPERATIONAL') ?? buses[0] ?? null;
  const nearestEta = nearestBus
    ? etas.find(e => e.busId === nearestBus.id) ?? null
    : null;

  let activeBus = buses.find(b => b.id === selectedBusId) ?? null;
  let activeEta = activeBus
    ? etas.find(e => e.busId === activeBus.id) ?? nearestEta
    : nearestEta;

  // Handle suggested route buses
  if (!activeBus && suggestedRoute && selectedBusId) {
    const sBus = suggestedRoute.buses_en_ruta.find(b => b.bus_id === selectedBusId);
    if (sBus) {
      activeBus = {
        id: sBus.bus_id,
        routeId: sBus.ruta, // Fallback to route string
        routeName: sBus.ruta,
        latitude: sBus.lat_actual,
        longitude: sBus.lon_actual,
        heading: 0,
        speed: sBus.velocidad_aprox_kmh,
        status: 'OPERATIONAL',
        capacity: 40,
        occupancy: suggestedRoute.bus_id_asignado === sBus.bus_id ? suggestedRoute.ocupacion_nivel : 'LOW'
      } as Bus;

      activeEta = {
        busId: sBus.bus_id,
        stationId: sBus.proxima_parada_id.toString(),
        stationName: sBus.nombre_proxima_parada,
        estimatedArrivalTime: new Date(Date.now() + (suggestedRoute.eta_minutos * 60000)).toISOString(),
        distanceMeters: 1000
      };
    }
  }

  // Polling for live buses
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchLiveBuses = async () => {
      try {
        const response = await TransportAPI.getLiveBuses();
        if (response.success && response.data) {
          const currentState = useTransportStore.getState();
          if (currentState.suggestedRoute) {
            currentState.setSuggestedRoute({
              ...currentState.suggestedRoute,
              buses_en_ruta: response.data
            });
          }
        }
      } catch (e) {
        console.error('Error fetching live buses:', e);
      }
    };

    // Initial fetch
    fetchLiveBuses();

    intervalId = setInterval(fetchLiveBuses, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectBus = useCallback((id: string | null) => {
    selectBus(id);
    if (id) selectStation(null);
  }, []);

  const handleSelectStation = useCallback(async (id: string | null) => {
    selectStation(id);
    if (id) {
      selectBus(null);
      setSearchQuery(''); // Clear search query when selecting a station

      // Call the new API to get the AI suggested route
      if (currentLocation) {
        setIsSearchingRoute(true);
        try {
          const response = await TransportAPI.getRouteSuggestion({
            user_lat: currentLocation.latitude,
            user_lon: currentLocation.longitude,
            destino_id: id
          });
          if (response.success) {
            setSuggestedRoute(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch route suggestion", error);
        } finally {
          setIsSearchingRoute(false);
        }
      }
    }
  }, [currentLocation, selectBus, selectStation]);

  const handleClearSuggestion = () => {
    setSuggestedRoute(null);
    selectStation(null);
  };

  const handleDetailsPress = (busId: string) => {
    selectBus(busId);
    navigation.navigate('BusDetails', { busId });
  };

  const handleMyLocation = async () => {
    startTracking();
    if (mapRef.current && currentLocation) {
      if (Platform.OS === 'web') {
        mapRef.current.flyTo([currentLocation.latitude, currentLocation.longitude], 16, { animate: true, duration: 1 });
      } else {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }, 800);
      }
    }
  };

  const handleZoomIn = async () => {
    if (!mapRef.current) return;
    if (Platform.OS === 'web') {
      mapRef.current.zoomIn();
    } else {
      const camera = await mapRef.current.getCamera();
      if (camera) {
        camera.altitude /= 2;
        camera.zoom += 1;
        mapRef.current.animateCamera(camera, { duration: 500 });
      }
    }
  };

  const handleZoomOut = async () => {
    if (!mapRef.current) return;
    if (Platform.OS === 'web') {
      mapRef.current.zoomOut();
    } else {
      const camera = await mapRef.current.getCamera();
      if (camera) {
        camera.altitude *= 2;
        camera.zoom -= 1;
        mapRef.current.animateCamera(camera, { duration: 500 });
      }
    }
  };

  return (
    <View style={styles.root}>
      {/* ── Fullscreen Map ── */}
      <InteractiveMap
        buses={showBuses ? buses : []}
        stations={showStations ? stations : []}
        routes={routes}
        userLocation={currentLocation}
        selectedBusId={selectedBusId}
        selectedRouteId={selectedRouteId}
        selectedStationId={selectedStationId}
        suggestedRoute={suggestedRoute}
        onSelectBus={handleSelectBus}
        onSelectStation={handleSelectStation}
        onMyLocation={handleMyLocation}
        mapRef={mapRef}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Top App Bar ── */}
      <SafeAreaView style={styles.headerSafe} pointerEvents="box-none">
        <View style={styles.header}>
          {suggestedRoute ? (
            <TouchableOpacity style={styles.backBtn} onPress={handleClearSuggestion} activeOpacity={0.7}>
              <ArrowLeft size={24} color="#000666" />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Transito Inteligente</Text>
            </View>
          )}

          {/* Right: settings */}
          {!suggestedRoute && (
            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
              <Settings size={22} color="#000666" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* ── Floating Search Bar ── */}
      {!suggestedRoute && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={isSearchingRoute ? "Buscando mejor ruta..." : "Busca una estación..."}
          suggestions={searchQuery.length > 1
            ? stations.filter(s => {
              const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              const q = normalize(searchQuery);
              return normalize(s.name).includes(q);
            }).map(s => ({ id: s.id, name: s.name }))
            : []}
          onSelectSuggestion={handleSelectStation}
        />
      )}

      {/* ── Map Controls ── */}
      <MapControls
        onMyLocation={handleMyLocation}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        showBuses={showBuses}
        showStations={showStations}
        onToggleBuses={() => setShowBuses(p => !p)}
        onToggleStations={() => setShowStations(p => !p)}
      />

      {/* ── Nearest Bus Card ── */}
      {(!suggestedRoute || (suggestedRoute && selectedBusId)) && (
        <NearestBusCard
          bus={activeBus ?? nearestBus}
          eta={activeEta}
          onDetails={handleDetailsPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  // ── Header ──
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#f7f9fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000666',
    letterSpacing: -0.3,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,6,102,0.05)',
  },
});

export default HomeScreen;
