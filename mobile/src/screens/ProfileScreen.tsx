import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Switch, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Header } from '../components/ui/Header';
import { useAuthStore } from '../store/authStore';
import { useTransportStore } from '../store/transportStore';
import { LogOut, Star, Clock, MapPin, Route, Settings, Bell, Circle } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { routes, stations } = useTransportStore();
  
  // Settings switches states
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  const handleLogout = () => {
    logout();
  };

  // Map route IDs to route names
  const favoriteRoutesList = routes.filter((r) => user?.favoriteRoutes.includes(r.id));
  const favoriteStationsList = stations.filter((s) => user?.favoriteStations.includes(s.id));

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Mi Perfil" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card header */}
        <View style={styles.userCard}>
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuario Demo'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@correo.com'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('favorites')}
            style={[styles.tabItem, activeTab === 'favorites' && styles.tabItemActive]}
          >
            <Star size={16} color={activeTab === 'favorites' ? '#0ea5e9' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
          >
            <Clock size={16} color={activeTab === 'history' ? '#0ea5e9' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Historial</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'favorites' ? (
          <View style={styles.favoritesSection}>
            <Text style={styles.sectionTitle}>Rutas Favoritas</Text>
            {favoriteRoutesList.length === 0 ? (
              <Text style={styles.emptyText}>No has guardado rutas como favoritas aún.</Text>
            ) : (
              favoriteRoutesList.map((rt) => (
                <View key={rt.id} style={styles.favRowItem}>
                  <View style={styles.favLeft}>
                    <Route size={16} color="#FF5E13" />
                    <View style={[styles.routeBadge, { backgroundColor: rt.color }]}>
                      <Text style={styles.routeBadgeText}>{rt.name.split(' - ')[0]}</Text>
                    </View>
                    <Text style={styles.favLabel} numberOfLines={1}>
                      {rt.name.split(' - ')[1]}
                    </Text>
                  </View>
                </View>
              ))
            )}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Estaciones Favoritas</Text>
            {favoriteStationsList.length === 0 ? (
              <Text style={styles.emptyText}>No has guardado estaciones como favoritas aún.</Text>
            ) : (
              favoriteStationsList.map((st) => (
                <View key={st.id} style={styles.favRowItem}>
                  <View style={styles.favLeft}>
                    <MapPin size={16} color="#0ea5e9" />
                    <Text style={[styles.favLabel, styles.stationLabelText]} numberOfLines={1}>
                      {st.name} ({st.code})
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Últimos Viajes</Text>
            {user?.tripHistory.length === 0 ? (
              <Text style={styles.emptyText}>No tienes un historial de viajes registrado.</Text>
            ) : (
              user?.tripHistory.map((trip) => (
                <View key={trip.id} style={styles.tripItem}>
                  <View style={styles.tripLeft}>
                    <Circle size={8} color="#FF5E13" fill="#FF5E13" style={styles.tripDot} />
                    <View>
                      <Text style={styles.tripRouteName}>Viaje en Línea {trip.routeName}</Text>
                      <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.tripRight}>
                    <Text style={styles.tripCost}>${trip.cost}</Text>
                    <Text style={styles.tripMetrics}>
                      {trip.durationMinutes} min • {trip.distanceKm} km
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Settings Area */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Ajustes de la Aplicación</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Settings size={18} color="#94A3B8" />
              <Text style={styles.settingLabel}>Modo Oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={18} color="#94A3B8" />
              <Text style={styles.settingLabel}>Notificaciones de Llegada</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: '#0ea5e9' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#222F4C',
    padding: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#151D30',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222F4C',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  tabText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#0ea5e9',
  },
  favoritesSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#222F4C',
    padding: 16,
    marginBottom: 20,
  },
  historySection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#222F4C',
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  favRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222F4C',
  },
  favLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  routeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  favLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  stationLabelText: {
    marginLeft: 10,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222F4C',
  },
  tripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDot: {
    marginRight: 10,
  },
  tripRouteName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  tripDate: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  tripRight: {
    alignItems: 'flex-end',
  },
  tripCost: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '700',
  },
  tripMetrics: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  settingsSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#222F4C',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222F4C',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
});
export default ProfileScreen;
