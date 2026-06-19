import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Bus, Station, Location, Route } from '../../types';
import { RouteSuggestionResponse } from '../../services/api';
import { BUCARAMANGA_CENTER } from '../../constants/mockData';
import { BusFront } from 'lucide-react-native';
import WebMap from './WebMap';

// Dynamically import MapView on native only
let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  Polyline = MapModule.Polyline;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
}



interface InteractiveMapProps {
  buses: Bus[];
  stations: Station[];
  routes?: Route[];
  userLocation: Location | null;
  selectedBusId: string | null;
  selectedRouteId: string | null;
  selectedStationId: string | null;
  suggestedRoute?: RouteSuggestionResponse['data'] | null;
  onSelectBus: (busId: string | null) => void;
  onSelectStation: (stationId: string | null) => void;
  onMyLocation?: () => void;
  mapRef?: React.RefObject<any>;
  style?: any;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  buses,
  stations,
  routes = [],
  userLocation,
  selectedBusId,
  selectedRouteId,
  selectedStationId,
  suggestedRoute,
  onSelectBus,
  onSelectStation,
  onMyLocation,
  mapRef: externalMapRef,
  style,
}) => {
  const internalRef = useRef<any>(null);
  const mapRef = externalMapRef ?? internalRef;
  const [regionDelta, setRegionDelta] = useState(0.06);

  // Animate to selected element
  useEffect(() => {
    if (Platform.OS === 'web' || !mapRef.current) return;
    
    if (suggestedRoute) {
      const { parada_mas_cercana, estacion_destino } = suggestedRoute;
      const coords = [
        { latitude: parada_mas_cercana.lat, longitude: parada_mas_cercana.lon },
        { latitude: estacion_destino.lat, longitude: estacion_destino.lon },
      ];
      if (userLocation) {
        coords.push({ latitude: userLocation.latitude, longitude: userLocation.longitude });
      }
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 150, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
      return;
    }

    if (selectedBusId) {
      const bus = buses.find(b => b.id === selectedBusId);
      if (bus) {
        mapRef.current.animateToRegion(
          { latitude: bus.latitude, longitude: bus.longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 },
          800
        );
      }
    } else if (selectedStationId) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station) {
        mapRef.current.animateToRegion(
          { latitude: station.latitude, longitude: station.longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 },
          800
        );
      }
    }
  }, [selectedBusId, selectedStationId, suggestedRoute, buses, stations, userLocation]);

  // ─── Native Map ───────────────────────────────────────────────────────────
  const renderMap = () => {
    // Center on user or Bucaramanga
    const initialRegion = userLocation
      ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
      : BUCARAMANGA_CENTER;

    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        customMapStyle={lightMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        onRegionChangeComplete={(region: any) => setRegionDelta(region.latitudeDelta)}
      >
        {/* Draw Polylines for routes */}
        {!suggestedRoute && routes.map(route => {
          // If a route is selected, show only that route. Otherwise show all active routes or selected bus route
          const isSelectedRoute = selectedRouteId === route.id;
          const isBusRoute = selectedBusId ? buses.find(b => b.id === selectedBusId)?.routeId === route.id : false;

          // Hide routes in natural state
          if (!selectedRouteId && !selectedBusId) return null;
          
          if (selectedRouteId && !isSelectedRoute) return null;
          if (selectedBusId && !isBusRoute && !isSelectedRoute) return null;

          const routeStations = route.stations
            .map(sId => stations.find(s => s.id === sId))
            .filter((s): s is Station => !!s);

          if (routeStations.length < 2) return null;

          return (
            <Polyline
              key={`poly_${route.id}`}
              coordinates={routeStations.map(s => ({ latitude: s.latitude, longitude: s.longitude }))}
              strokeColor={route.color}
              strokeWidth={isSelectedRoute || isBusRoute ? 5 : 3}
              lineDashPattern={route.isActive ? undefined : [10, 10]}
              zIndex={isSelectedRoute || isBusRoute ? 5 : 1}
            />
          );
        })}

        {/* Suggested Route Path */}
        {suggestedRoute && (
          <Polyline
            coordinates={[
              { latitude: suggestedRoute.parada_mas_cercana.lat, longitude: suggestedRoute.parada_mas_cercana.lon },
              { latitude: suggestedRoute.estacion_destino.lat, longitude: suggestedRoute.estacion_destino.lon },
            ]}
            strokeColor="#1E40AF"
            strokeWidth={5}
            lineDashPattern={[10, 10]}
            zIndex={5}
          />
        )}

        {/* User location pulse marker */}
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        )}

        {/* Station markers */}
        {!suggestedRoute && stations.map(station => {
          const isSel = selectedStationId === station.id;
          return (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              onPress={() => onSelectStation(station.id)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={[styles.stationDot, isSel && styles.stationDotSelected]}>
                  {isSel && <View style={styles.stationDotInner} />}
                </View>
                {regionDelta < 0.02 && (
                  <View style={styles.stationLabelContainer}>
                    <Text style={styles.stationLabelText} numberOfLines={2}>{station.name}</Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}

        {/* Suggested Route Stations */}
        {suggestedRoute && (
          <>
            <Marker
              coordinate={{ latitude: suggestedRoute.parada_mas_cercana.lat, longitude: suggestedRoute.parada_mas_cercana.lon }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.stationDot, styles.stationDotSelected]}>
                <View style={styles.stationDotInner} />
              </View>
            </Marker>
            <Marker
              coordinate={{ latitude: suggestedRoute.estacion_destino.lat, longitude: suggestedRoute.estacion_destino.lon }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.stationDot, { borderColor: '#E11D48' }]}>
                <View style={[styles.stationDotInner, { backgroundColor: '#E11D48' }]} />
              </View>
            </Marker>
          </>
        )}

        {/* Bus markers */}
        {!suggestedRoute && buses.map(bus => {
          const isSel = selectedBusId === bus.id;
          return (
            <Marker
              key={bus.id}
              coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
              onPress={() => onSelectBus(bus.id)}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={styles.nativeBusMarker}>
                <View style={[styles.nativeBusLabel, isSel && styles.nativeBusLabelSelected]}>
                  <Text style={styles.nativeBusLabelText}>{bus.routeName}</Text>
                </View>
                <View style={styles.busMarkerWrapper}>
                  {/* Direction arrow */}
                  <View style={[styles.directionArrow, { transform: [{ rotate: `${bus.heading}deg` }] }]}>
                    <View style={styles.arrowHead} />
                  </View>
                  <View style={[styles.nativeBusCircle, isSel && styles.nativeBusCircleSelected, { backgroundColor: routes.find(r => r.id === bus.routeId)?.color || '#000666' }]}>
                    <BusFront size={20} color="#ffffff" />
                  </View>
                </View>
              </View>
            </Marker>
          );
        })}

        {/* Suggested Route Buses */}
        {suggestedRoute && suggestedRoute.buses_en_ruta && suggestedRoute.buses_en_ruta.map(bus => {
          const isAssigned = suggestedRoute.bus_id_asignado === bus.bus_id;
          return (
            <Marker
              key={bus.bus_id}
              coordinate={{ latitude: bus.lat_actual, longitude: bus.lon_actual }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => onSelectBus(bus.bus_id)}
            >
              <View style={styles.nativeBusMarker}>
                <View style={[styles.nativeBusLabel, isAssigned && styles.nativeBusLabelSelected]}>
                  <Text style={styles.nativeBusLabelText}>{bus.ruta}</Text>
                </View>
                <View style={styles.busMarkerWrapper}>
                  <View style={[styles.nativeBusCircle, isAssigned && styles.nativeBusCircleSelected, { backgroundColor: isAssigned ? '#1E40AF' : '#64748B' }]}>
                    <BusFront size={20} color="#ffffff" />
                  </View>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
    );
  };

  return (
    <View style={[styles.root, style]}>
      {Platform.OS === 'web' ? (
        <WebMap
          buses={buses}
          stations={stations}
          routes={routes}
          userLocation={userLocation}
          selectedBusId={selectedBusId}
          selectedRouteId={selectedRouteId}
          selectedStationId={selectedStationId}
          suggestedRoute={suggestedRoute}
          onSelectBus={onSelectBus}
          onSelectStation={onSelectStation}
          mapRef={mapRef}
        />
      ) : (
        renderMap()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#eceef1',
  },
  // ── Native ──
  userMarkerOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,86,197,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0056c5',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  stationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000666',
  },
  stationDotSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#000666',
    borderColor: '#ffffff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  stationLabelContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    width: 80,
    alignItems: 'center',
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  stationLabelText: {
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: '600',
  },
  nativeBusMarker: {
    alignItems: 'center',
  },
  nativeBusLabel: {
    backgroundColor: '#0056c5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nativeBusLabelSelected: {
    backgroundColor: '#000666',
  },
  nativeBusLabelText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  nativeBusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000666',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  nativeBusCircleSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  busMarkerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  directionArrow: {
    position: 'absolute',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000666',
    top: -4,
  },
});

// Light Google Maps style
const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];

export default InteractiveMap;
