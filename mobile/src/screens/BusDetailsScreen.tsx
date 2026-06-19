import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useTransportData } from '../hooks/useTransportData';
import { useTransportStore } from '../store/transportStore';
import { ArrowLeft, CheckCircle2, Users, MapPin, Bus as BusIcon } from 'lucide-react-native';

type BusDetailsRouteProp = RouteProp<RootStackParamList, 'BusDetails'>;

export const BusDetailsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const routeParams = useRoute<BusDetailsRouteProp>();
  const { busId } = routeParams.params;

  const { buses, routes, stations, etas } = useTransportData();
  const { suggestedRoute } = useTransportStore();

  let bus = buses.find((b) => b.id === busId) ?? null;
  let route = routes.find((r) => r.id === bus?.routeId) ?? null;
  
  // Find current/next station
  let busEtas = etas.filter((e) => e.busId === busId).sort((a, b) => a.etaMinutes - b.etaMinutes);
  let nextEta = busEtas[0] ?? null;
  let nextStation = nextEta ? stations.find((s) => s.id === nextEta.stationId) : null;
  
  let routeStations: any[] = [];
  let isSuggestedBus = false;

  // If bus is not found, check if it's a suggested route bus!
  if (!bus && suggestedRoute) {
    const sBus = suggestedRoute.buses_en_ruta.find(b => b.bus_id === busId);
    if (sBus) {
      isSuggestedBus = true;
      bus = {
        id: sBus.bus_id,
        routeId: sBus.ruta,
        routeName: sBus.ruta,
        latitude: sBus.lat_actual,
        longitude: sBus.lon_actual,
        heading: 0,
        speed: sBus.velocidad_aprox_kmh,
        status: 'OPERATIONAL',
        capacity: 40,
        occupancy: suggestedRoute.bus_id_asignado === sBus.bus_id ? suggestedRoute.ocupacion_nivel : 'LOW'
      } as any;
      
      route = {
        id: sBus.ruta,
        name: sBus.ruta,
        origin: 'Origen',
        destination: 'Destino',
        color: suggestedRoute.bus_id_asignado === sBus.bus_id ? '#1E40AF' : '#64748B',
        stations: [suggestedRoute.parada_mas_cercana.id, suggestedRoute.estacion_destino.id],
        isActive: true
      } as any;

      nextStation = {
        id: sBus.proxima_parada_id.toString(),
        name: sBus.nombre_proxima_parada,
        latitude: 0,
        longitude: 0,
        code: 'N/A',
        status: 'ACTIVE'
      } as any;

      nextEta = {
        busId: sBus.bus_id,
        stationId: sBus.proxima_parada_id.toString(),
        stationName: sBus.nombre_proxima_parada,
        estimatedArrivalTime: new Date(Date.now() + (suggestedRoute.eta_minutos * 60000)).toISOString(),
        distanceMeters: 1000,
        etaMinutes: suggestedRoute.eta_minutos
      } as any;

      routeStations = [
        suggestedRoute.parada_mas_cercana,
        nextStation,
        suggestedRoute.estacion_destino
      ];
    }
  }

  if (!isSuggestedBus && route) {
    routeStations = route.stations.map((sId) => stations.find((s) => s.id === sId)).filter(Boolean) as any[];
  }

  const handleBack = () => {
    navigation.goBack();
  };

  if (!bus || !route) {
    return (
      <View style={styles.errorContainer}>
        <Text>Bus no encontrado.</Text>
        <TouchableOpacity onPress={handleBack} style={{ marginTop: 20 }}>
          <Text style={{ color: '#0056c5' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nextStationIndex = routeStations.findIndex((s) => s.id === nextStation?.id) || 0;
  
  // Determine delay (mocking based on status)
  const isDelayed = bus.status === 'DELAYED';
  const delayMins = isDelayed ? 5 : 0;
  const statusColor = isDelayed ? '#e53935' : '#10b981';
  const statusBg = isDelayed ? '#fee2e2' : '#d1fae5';

  const getOccupancyInfo = (level: string) => {
    switch(level) {
      case 'LOW': return { current: 10, max: 40, percentage: 25 };
      case 'MEDIUM': return { current: 20, max: 40, percentage: 50 };
      case 'HIGH': return { current: 32, max: 40, percentage: 80 };
      case 'FULL': return { current: 40, max: 40, percentage: 100 };
      default: return { current: 24, max: 40, percentage: 60 };
    }
  };
  const occ = getOccupancyInfo(bus.occupancy);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transito Inteligente</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Bus Hero Image */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000' }} 
          style={styles.heroImage}
          imageStyle={styles.heroImageRadius}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.liveBadgeRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.heroRouteText}>{route.name}</Text>
            </View>
            <Text style={styles.heroBusName}>Bus #{bus.id.replace('bus-', '')}</Text>
          </View>
        </ImageBackground>

        {/* 2x2 Grid using Flex Wrap */}
        <View style={styles.grid}>
          
          {/* Card 1: ETA Status */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <CheckCircle2 size={20} color={statusColor} />
              <Text style={styles.cardTitle}>Hora de llegada estimada</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusPillText, { color: statusColor }]}>
                {isDelayed ? 'DELAYED' : 'ON TIME'}
              </Text>
            </View>
            <Text style={styles.cardSubText}>+{delayMins} min delay</Text>
          </View>

          {/* Card 2: Occupancy */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Users size={20} color="#0056c5" />
              <Text style={[styles.cardTitle, { textAlign: 'right', flex: 1 }]}>Occupancy</Text>
            </View>
            <Text style={styles.cardValue}>{occ.current}/{occ.max}</Text>
            <Text style={styles.cardSubText}>{occ.percentage}% Capacity</Text>
          </View>

          {/* Card 3: Next Stop */}
          <View style={[styles.card, styles.fullWidthCard]}>
            <View style={styles.cardHeaderRow}>
              <MapPin size={20} color="#0056c5" />
              <Text style={[styles.cardTitle, { flex: 1, marginLeft: 8 }]}>Next Stop</Text>
            </View>
            <Text style={[styles.cardValue, { color: '#000666', fontSize: 18, marginTop: 8 }]}>
              {nextStation ? nextStation.name : 'Finalizando ruta'}
            </Text>
            <Text style={styles.cardSubText}>ETA: {nextEta ? nextEta.etaMinutes : '--'} mins</Text>
          </View>

        </View>

        {/* Real-time Route Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Real-time Route</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
            {routeStations.map((station, index) => {
              const isPast = index < nextStationIndex;
              const isCurrent = index === nextStationIndex;
              const isFuture = index > nextStationIndex;

              return (
                <View key={station.id} style={styles.timelineNode}>
                  <View style={styles.timelineDotContainer}>
                    {/* Line behind dots */}
                    {index > 0 && (
                      <View style={[styles.timelineLine, isPast || isCurrent ? styles.timelineLineActive : null]} />
                    )}
                    
                    {/* The Dot */}
                    <View style={[
                      styles.dot,
                      isPast && styles.dotPast,
                      isCurrent && styles.dotCurrent,
                      isFuture && styles.dotFuture,
                    ]}>
                      {isCurrent && <BusIcon size={14} color="#ffffff" />}
                    </View>
                  </View>
                  
                  <Text style={[styles.timelineStationName, isCurrent && styles.timelineStationNameActive]} numberOfLines={2}>
                    {station.name}
                  </Text>
                  
                  {isCurrent && (
                    <View style={styles.currentLocationBadge}>
                      <Text style={styles.currentLocationText}>Current Location</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000666',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  heroImageRadius: {
    borderRadius: 16,
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#86efac',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },
  heroRouteText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroBusName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000666',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 13,
    color: '#64748b',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000666',
    marginBottom: 30,
  },
  timelineScroll: {
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  timelineNode: {
    width: 100,
    alignItems: 'center',
  },
  timelineDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: '100%',
    marginBottom: 12,
  },
  timelineLine: {
    position: 'absolute',
    left: -50,
    right: 50,
    height: 3,
    backgroundColor: '#e2e8f0',
    zIndex: 0,
  },
  timelineLineActive: {
    backgroundColor: '#0056c5',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  dotPast: {
    backgroundColor: '#0056c5',
    borderColor: '#0056c5',
  },
  dotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000666',
    borderColor: '#c7d2fe',
    borderWidth: 4,
  },
  dotFuture: {
    borderColor: '#94a3b8',
  },
  timelineStationName: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
  },
  timelineStationNameActive: {
    color: '#000000',
    fontWeight: '800',
  },
  currentLocationBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  currentLocationText: {
    fontSize: 9,
    color: '#000666',
    fontWeight: '700',
  },
});

export default BusDetailsScreen;
