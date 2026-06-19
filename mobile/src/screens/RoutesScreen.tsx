import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTransportData } from '../hooks/useTransportData';
import { useAuthStore } from '../store/authStore';
import { useTransportStore } from '../store/transportStore';
import { Route } from '../types';
import { Search, ArrowRight, MapPin } from 'lucide-react-native';

interface RoutesScreenProps {
  navigation: any;
}

const OccupancyDot: React.FC<{ color: string }> = ({ color }) => (
  <View style={[routeStyles.dot, { backgroundColor: color }]} />
);

export const RoutesScreen: React.FC<RoutesScreenProps> = ({ navigation }) => {
  const { routes, buses, isLoading } = useTransportData();
  const { user, toggleFavoriteRoute } = useAuthStore();
  const { selectedRouteId, selectRoute } = useTransportStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectRoute = (route: Route) => {
    selectRoute(route.id);
    navigation.navigate('Inicio');
  };

  const handleViewBusDetails = (route: Route) => {
    const routeBuses = buses.filter(b => b.routeId === route.id && b.status === 'OPERATIONAL');
    if (routeBuses.length > 0) {
      navigation.navigate('BusDetails', { busId: routeBuses[0].id });
    } else {
      handleSelectRoute(route);
    }
  };

  const filteredRoutes = routes.filter(r => {
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const q = normalize(searchQuery);
    return (
      normalize(r.name).includes(q) ||
      normalize(r.origin).includes(q) ||
      normalize(r.destination).includes(q)
    );
  });

  const getBusCountForRoute = (routeId: string) =>
    buses.filter(b => b.routeId === routeId && b.status === 'OPERATIONAL').length;

  return (
    <View style={styles.root}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Líneas y Rutas</Text>
          <Text style={styles.headerSub}>{routes.length} rutas activas</Text>
        </View>
      </SafeAreaView>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={18} color="#454652" />
          <TextInput
            placeholder="Buscar ruta, origen o destino..."
            placeholderTextColor="rgba(69,70,82,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#000666" />
          <Text style={styles.loadingText}>Cargando rutas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isFav = user?.favoriteRoutes.includes(item.id);
            const isSelected = selectedRouteId === item.id;
            const activeBuses = getBusCountForRoute(item.id);
            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelectRoute(item)}
                activeOpacity={0.85}
              >
                {/* Color strip */}
                <View style={[styles.colorStrip, { backgroundColor: item.color }]} />

                <View style={styles.cardBody}>
                  {/* Top row */}
                  <View style={styles.cardTop}>
                    <View style={styles.routeNameRow}>
                      <Text style={styles.routeName}>{item.name}</Text>
                      {isSelected && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>Activa</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Origin → Destination */}
                  <View style={styles.routeFlow}>
                    <MapPin size={12} color="#454652" />
                    <Text style={styles.routeOrigin} numberOfLines={1}>{item.origin}</Text>
                    <Text style={styles.routeArrow}>→</Text>
                    <Text style={styles.routeDest} numberOfLines={1}>{item.destination}</Text>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <View style={styles.busCount}>
                      <View style={styles.liveDot} />
                      <Text style={styles.busCountText}>
                        {activeBuses} bus{activeBuses !== 1 ? 'es' : ''} activo{activeBuses !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.stationsCount}>
                      <Text style={styles.stationsText}>{item.stations.length} paradas</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => handleViewBusDetails(item)}
                    >
                      <Text style={styles.viewBtnText}>Ver</Text>
                      <ArrowRight size={12} color="#000666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🗺️</Text>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySub}>Intenta con "T1" o "UIS"</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f7f9fc' },
  headerSafe: { backgroundColor: '#f7f9fc' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eceef1',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#000666' },
  headerSub: { fontSize: 13, color: '#454652', marginTop: 2 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e8eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#191c1e' },
  listContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#454652', fontSize: 14 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#454652' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eceef1',
  },
  cardSelected: {
    borderColor: '#000666',
    borderWidth: 1.5,
  },
  colorStrip: { width: 5, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  cardBody: { flex: 1, padding: 14, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  routeNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeName: { fontSize: 15, fontWeight: '700', color: '#191c1e', flexShrink: 1 },
  activeBadge: {
    backgroundColor: 'rgba(0,6,102,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgeText: { fontSize: 11, fontWeight: '700', color: '#000666' },
  routeFlow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeOrigin: { fontSize: 12, color: '#454652', flex: 1 },
  routeArrow: { fontSize: 12, color: '#767683' },
  routeDest: { fontSize: 12, color: '#454652', flex: 1, textAlign: 'right' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eceef1',
  },
  busCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#00e475' },
  busCountText: { fontSize: 12, color: '#454652' },
  stationsCount: {},
  stationsText: { fontSize: 12, color: '#767683' },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,6,102,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: '#000666' },
});

const routeStyles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default RoutesScreen;
