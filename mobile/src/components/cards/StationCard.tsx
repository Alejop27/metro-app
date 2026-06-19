import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Station, ETA, Bus } from '../../types';
import { Star, MapPin, Bus as BusIcon, Clock } from 'lucide-react-native';

interface StationCardProps {
  station: Station;
  etas: ETA[];
  buses: Bus[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  etas,
  buses,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  isSelected = false,
}) => {
  // Find ETAs for this station
  const stationEtas = etas
    .filter((eta) => eta.stationId === station.id)
    .sort((a, b) => a.etaMinutes - b.etaMinutes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#10B981';
      case 'TEMPORARILY_CLOSED': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Operativo';
      case 'TEMPORARILY_CLOSED': return 'Cerrado';
      default: return 'Mantenimiento';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MapPin size={18} color="#0ea5e9" style={styles.pinIcon} />
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>{station.name}</Text>
            <Text style={styles.code}>{station.code}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Star
            size={20}
            color={isFavorite ? '#FBBF24' : '#64748B'}
            fill={isFavorite ? '#FBBF24' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(station.status) }]} />
        <Text style={[styles.statusText, { color: getStatusColor(station.status) }]}>
          {getStatusLabel(station.status)}
        </Text>
      </View>

      <View style={styles.etaSection}>
        <Text style={styles.sectionTitle}>Próximos Buses:</Text>
        {stationEtas.length === 0 ? (
          <Text style={styles.noBusesText}>No se reportan buses cercanos a esta parada.</Text>
        ) : (
          stationEtas.slice(0, 3).map((eta, index) => {
            const bus = buses.find((b) => b.id === eta.busId);
            return (
              <View key={index} style={styles.etaItem}>
                <View style={styles.etaLeft}>
                  <BusIcon size={14} color="#F8FAFC" />
                  <View style={styles.routeBadge}>
                    <Text style={styles.routeBadgeText}>
                      {bus ? bus.routeName : 'Bus'}
                    </Text>
                  </View>
                  <Text style={styles.busIdText}>#{eta.busId.replace('bus_', '')}</Text>
                </View>
                <View style={styles.etaRight}>
                  <Clock size={12} color="#0ea5e9" style={styles.clockIcon} />
                  <Text style={styles.etaMinutesText}>{eta.etaMinutes} min</Text>
                  <Text style={styles.etaDistanceText}>({(eta.distanceMeters / 1000).toFixed(1)} km)</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 14,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: '#0ea5e9',
    backgroundColor: '#131C2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    marginRight: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  code: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  etaSection: {
    backgroundColor: '#0B0F19',
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 6,
  },
  noBusesText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  etaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#222F4C',
  },
  etaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeBadge: {
    backgroundColor: '#FF5E13',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
    marginRight: 6,
  },
  routeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  busIdText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  etaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  etaMinutesText: {
    color: '#0ea5e9',
    fontWeight: '700',
    fontSize: 13,
  },
  etaDistanceText: {
    color: '#64748B',
    fontSize: 11,
    marginLeft: 4,
  },
});
export default StationCard;
