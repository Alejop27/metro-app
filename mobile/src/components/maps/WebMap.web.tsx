import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Station, Location, Route } from '../../types';
import { RouteSuggestionResponse } from '../../services/api';
import { BUCARAMANGA_CENTER } from '../../constants/mockData';

// Fix for default leaflet marker icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface WebMapProps {
  buses: Bus[];
  stations: Station[];
  routes?: Route[];
  userLocation: Location | null;
  selectedBusId: string | null;
  selectedRouteId: string | null;
  selectedStationId: string | null;
  onSelectBus: (busId: string | null) => void;
  onSelectStation: (stationId: string | null) => void;
  mapRef?: React.Ref<any>;
  suggestedRoute?: RouteSuggestionResponse['data'] | null;
}

const MapUpdater: React.FC<{
  selectedBusId: string | null;
  selectedStationId: string | null;
  buses: Bus[];
  stations: Station[];
  suggestedRoute?: RouteSuggestionResponse['data'] | null;
  userLocation: Location | null;
  setZoom: (z: number) => void;
}> = ({ selectedBusId, selectedStationId, buses, stations, suggestedRoute, userLocation, setZoom }) => {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoom);
    // initial zoom
    handleZoom();
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, setZoom]);

  useEffect(() => {
    if (suggestedRoute) {
      const bounds = L.latLngBounds(
        [suggestedRoute.parada_mas_cercana.lat, suggestedRoute.parada_mas_cercana.lon],
        [suggestedRoute.estacion_destino.lat, suggestedRoute.estacion_destino.lon]
      );
      if (userLocation) {
        bounds.extend([userLocation.latitude, userLocation.longitude]);
      }
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
      return;
    }

    if (selectedBusId) {
      const bus = buses.find((b) => b.id === selectedBusId);
      if (bus) {
        map.flyTo([bus.latitude, bus.longitude], 15, { animate: true, duration: 1 });
      }
    } else if (selectedStationId) {
      const station = stations.find((s) => s.id === selectedStationId);
      if (station) {
        map.flyTo([station.latitude, station.longitude], 16, { animate: true, duration: 1 });
      }
    }
  }, [selectedBusId, selectedStationId, suggestedRoute, map, userLocation]);

  return null;
};

export const WebMap: React.FC<WebMapProps> = ({
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
  mapRef,
}) => {
  const [zoomLevel, setZoomLevel] = useState(13);

  const getBusIcon = (heading: number, color: string, isSelected: boolean) => {
    return L.divIcon({
      html: `
        <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; transform: rotate(${heading}deg); width: 44px; height: 44px; display: flex; align-items: flex-start; justify-content: center;">
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid #000666; margin-top: -4px;"></div>
          </div>
          <div style="width: 38px; height: 38px; border-radius: 19px; background-color: ${color}; border: ${isSelected ? '3px' : '2px'} solid white; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0px 3px 5px rgba(0,0,0,0.25);">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus-front"><path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 21v-2"/></svg>
          </div>
        </div>
      `,
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  const getStationIcon = (isSelected: boolean) => {
    return L.divIcon({
      html: `
        <div style="width: ${isSelected ? '18px' : '14px'}; height: ${isSelected ? '18px' : '14px'}; border-radius: ${isSelected ? '9px' : '7px'}; background-color: ${isSelected ? '#000666' : '#ffffff'}; border: 2px solid ${isSelected ? '#ffffff' : '#000666'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          ${isSelected ? '<div style="width: 6px; height: 6px; border-radius: 3px; background-color: #ffffff;"></div>' : ''}
        </div>
      `,
      className: '',
      iconSize: isSelected ? [18, 18] : [14, 14],
      iconAnchor: isSelected ? [9, 9] : [7, 7],
    });
  };

  const userIcon = L.divIcon({
    html: `
      <div style="width: 28px; height: 28px; border-radius: 14px; background-color: rgba(0,86,197,0.2); display: flex; align-items: center; justify-content: center;">
        <div style="width: 12px; height: 12px; border-radius: 6px; background-color: #0056c5; border: 2px solid white;"></div>
      </div>
    `,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  return (
    <View style={styles.container}>
      <MapContainer
        center={[BUCARAMANGA_CENTER.latitude, BUCARAMANGA_CENTER.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater
          selectedBusId={selectedBusId}
          selectedStationId={selectedStationId}
          buses={buses}
          stations={stations}
          suggestedRoute={suggestedRoute}
          userLocation={userLocation}
          setZoom={setZoomLevel}
        />

        {/* Polylines for routes */}
        {!suggestedRoute && routes.map((route) => {
          const isSelectedRoute = selectedRouteId === route.id;
          const isBusRoute = selectedBusId ? buses.find((b) => b.id === selectedBusId)?.routeId === route.id : false;

          // Hide routes in natural state
          if (!selectedRouteId && !selectedBusId) return null;

          if (selectedRouteId && !isSelectedRoute) return null;
          if (selectedBusId && !isBusRoute && !isSelectedRoute) return null;

          const routeStations = route.stations
            .map((sId) => stations.find((s) => s.id === sId))
            .filter((s): s is Station => !!s);

          if (routeStations.length < 2) return null;

          return (
            <Polyline
              key={`poly_${route.id}`}
              positions={routeStations.map((s) => [s.latitude, s.longitude])}
              color={route.color}
              weight={isSelectedRoute || isBusRoute ? 5 : 3}
              dashArray={route.isActive ? undefined : '10, 10'}
            />
          );
        })}

        {/* Suggested Route Path */}
        {suggestedRoute && (
          <Polyline
            positions={[
              [suggestedRoute.parada_mas_cercana.lat, suggestedRoute.parada_mas_cercana.lon],
              [suggestedRoute.estacion_destino.lat, suggestedRoute.estacion_destino.lon],
            ]}
            color="#1E40AF"
            weight={5}
            dashArray="10, 10"
          />
        )}

        {/* User Location */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />
        )}

        {/* Stations */}
        {!suggestedRoute && stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={getStationIcon(selectedStationId === station.id)}
            eventHandlers={{ click: () => onSelectStation(station.id) }}
          >
            {zoomLevel > 14 && (
              <Tooltip direction="bottom" offset={[0, 10]} opacity={0.9} permanent>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                  {station.name}
                </div>
              </Tooltip>
            )}
          </Marker>
        ))}

        {/* Suggested Route Stations */}
        {suggestedRoute && (
          <>
            <Marker
              position={[suggestedRoute.parada_mas_cercana.lat, suggestedRoute.parada_mas_cercana.lon]}
              icon={getStationIcon(true)}
            />
            <Marker
              position={[suggestedRoute.estacion_destino.lat, suggestedRoute.estacion_destino.lon]}
              icon={L.divIcon({
                html: `
                  <div style="width: 18px; height: 18px; border-radius: 9px; background-color: #E11D48; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    <div style="width: 6px; height: 6px; border-radius: 3px; background-color: #ffffff;"></div>
                  </div>
                `,
                className: '',
                iconSize: [18, 18],
                iconAnchor: [9, 9],
              })}
            />
          </>
        )}

        {/* Buses */}
        {!suggestedRoute && buses.map((bus) => {
          const isSel = selectedBusId === bus.id;
          const routeColor = routes.find((r) => r.id === bus.routeId)?.color || '#000666';

          return (
            <Marker
              key={bus.id}
              position={[bus.latitude, bus.longitude]}
              icon={getBusIcon(bus.heading, routeColor, isSel)}
              eventHandlers={{ click: () => onSelectBus(bus.id) }}
            />
          );
        })}

        {/* Suggested Route Buses */}
        {suggestedRoute && suggestedRoute.buses_en_ruta && suggestedRoute.buses_en_ruta.map((bus) => {
          const isAssigned = suggestedRoute.bus_id_asignado === bus.bus_id;
          return (
            <Marker
              key={bus.bus_id}
              position={[bus.lat_actual, bus.lon_actual]}
              icon={getBusIcon(0, isAssigned ? '#1E40AF' : '#64748B', isAssigned)}
              eventHandlers={{ click: () => onSelectBus(bus.bus_id) }}
            />
          );
        })}
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default WebMap;
