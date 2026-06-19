import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Route } from '../../types';
import { Star, ArrowRight } from 'lucide-react-native';

interface RouteCardProps {
  route: Route;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      {/* Route Color vertical bar */}
      <View style={[styles.colorBar, { backgroundColor: route.color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: route.color + '20' }]}>
            <Text style={[styles.badgeText, { color: route.color }]}>{route.name.split(' - ')[0]}</Text>
          </View>
          
          <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
            <Star
              size={20}
              color={isFavorite ? '#FBBF24' : '#64748B'}
              fill={isFavorite ? '#FBBF24' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.routeNameText}>{route.name.split(' - ')[1] || route.name}</Text>
        
        <View style={styles.routePathContainer}>
          <Text style={styles.stationText} numberOfLines={1}>{route.origin}</Text>
          <ArrowRight size={12} color="#64748B" style={styles.arrow} />
          <Text style={styles.stationText} numberOfLines={1}>{route.destination}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.stationCountText}>
            {route.stations.length} Estaciones habilitadas
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    marginBottom: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#0ea5e9',
    backgroundColor: '#131C2E',
  },
  colorBar: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  favoriteButton: {
    padding: 4,
  },
  routeNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  routePathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationText: {
    fontSize: 13,
    color: '#94A3B8',
    maxWidth: '43%',
  },
  arrow: {
    marginHorizontal: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  stationCountText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});
export default RouteCard;
