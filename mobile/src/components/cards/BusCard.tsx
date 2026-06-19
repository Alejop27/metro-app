import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bus, ETA } from '../../types';
import { Navigation, ShieldAlert, Sparkles, Navigation2 } from 'lucide-react-native';
import { useAIModel } from '../../hooks/useAIModel';

interface BusCardProps {
  bus: Bus;
  eta?: ETA;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  eta,
  onSelect,
  isSelected = false,
}) => {
  const { predictArrival, isPredictingArrival, arrivalPrediction } = useAIModel();
  const [showAIPanel, setShowAIPanel] = useState(false);

  const getOccupancyColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#10B981'; // Green
      case 'MEDIUM': return '#F59E0B'; // Yellow
      case 'HIGH': return '#EF4444'; // Orange/Red
      case 'FULL': return '#7F1D1D'; // Dark Red
      default: return '#64748B';
    }
  };

  const getOccupancyLabel = (level: string) => {
    switch (level) {
      case 'LOW': return 'Poca Ocupación';
      case 'MEDIUM': return 'Ocupación Media';
      case 'HIGH': return 'Ocupación Alta';
      case 'FULL': return 'Cupo Máximo';
      default: return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return '#10B981';
      case 'DELAYED': return '#F59E0B';
      case 'ACCIDENT': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'En Ruta';
      case 'DELAYED': return 'Retrasado';
      case 'ACCIDENT': return 'Accidente';
      case 'OUT_OF_SERVICE': return 'Fuera de Servicio';
      default: return 'Inactivo';
    }
  };

  const handlePredictArrival = async () => {
    if (!eta) return;
    await predictArrival(bus.id, eta.stationId, bus.routeId);
    setShowAIPanel(true);
  };

  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8} style={styles.cardHeader}>
        <View style={styles.routeBadgeContainer}>
          <View style={styles.routeBadge}>
            <Text style={styles.routeName}>{bus.routeName}</Text>
          </View>
          <Text style={styles.busId}>Vehículo #{bus.id.replace('bus_', '')}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(bus.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(bus.status) }]}>
            {getStatusLabel(bus.status)}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Velocidad</Text>
            <Text style={styles.metricValue}>{bus.speed} km/h</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Dirección</Text>
            <View style={styles.directionContainer}>
              <Navigation2 size={14} color="#38BDF8" style={{ transform: [{ rotate: `${bus.heading}deg` }] }} />
              <Text style={styles.metricValue}> {bus.heading}°</Text>
            </View>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Pasajeros</Text>
            <View style={[styles.badge, { backgroundColor: getOccupancyColor(bus.occupancy) + '20' }]}>
              <Text style={[styles.badgeText, { color: getOccupancyColor(bus.occupancy) }]}>
                {getOccupancyLabel(bus.occupancy)}
              </Text>
            </View>
          </View>
        </View>

        {eta && (
          <View style={styles.etaContainer}>
            <View style={styles.etaTextContainer}>
              <Text style={styles.etaTitle}>Próxima Parada</Text>
              <Text style={styles.etaValue}>
                {eta.etaMinutes} min ({ (eta.distanceMeters / 1000).toFixed(1) } km)
              </Text>
              <Text style={styles.etaStops}>{eta.remainingStops} paradas restantes</Text>
            </View>
            
            <TouchableOpacity 
              onPress={handlePredictArrival} 
              style={styles.aiButton}
              disabled={isPredictingArrival}
            >
              {isPredictingArrival ? (
                <ActivityIndicator size="small" color="#0ea5e9" />
              ) : (
                <>
                  <Sparkles size={16} color="#0ea5e9" />
                  <Text style={styles.aiButtonText}>Predecir IA</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {showAIPanel && arrivalPrediction && (
          <View style={styles.aiPanel}>
            <View style={styles.aiPanelHeader}>
              <Sparkles size={14} color="#FFE600" />
              <Text style={styles.aiPanelTitle}>Predicción de IA Realizada</Text>
            </View>
            <View style={styles.aiMetricsRow}>
              <View>
                <Text style={styles.aiMetricLabel}>ETA Predecido</Text>
                <Text style={styles.aiMetricValue}>{arrivalPrediction.etaMinutes} mins</Text>
              </View>
              <View>
                <Text style={styles.aiMetricLabel}>Confianza del Modelo</Text>
                <Text style={styles.aiMetricValue}>{(arrivalPrediction.confidenceScore * 100).toFixed(0)}%</Text>
              </View>
            </View>
            <View style={styles.factorsList}>
              <Text style={styles.factorsTitle}>Factores considerados:</Text>
              {arrivalPrediction.factors.map((factor, index) => (
                <Text key={index} style={styles.factorText}>• {factor}</Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowAIPanel(false)} style={styles.closeAiButton}>
              <Text style={styles.closeAiButtonText}>Cerrar Panel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#0ea5e9',
    backgroundColor: '#131C2E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
    marginBottom: 10,
  },
  routeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeBadge: {
    backgroundColor: '#FF5E13',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  routeName: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  busId: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  body: {},
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  etaContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  etaTextContainer: {
    flex: 1,
  },
  etaTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  etaValue: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  etaStops: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e91A',
    borderWidth: 1,
    borderColor: '#0ea5e933',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  aiButtonText: {
    color: '#0ea5e9',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  aiPanel: {
    backgroundColor: '#1E2235',
    borderWidth: 1,
    borderColor: '#FFE60055',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPanelTitle: {
    color: '#FFE600',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE6001A',
    paddingBottom: 8,
  },
  aiMetricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
  },
  aiMetricValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
  },
  factorsList: {
    marginBottom: 8,
  },
  factorsTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  factorText: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  closeAiButton: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  closeAiButtonText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
});
export default BusCard;
