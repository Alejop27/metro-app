import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Bus, ETA } from '../../types';
import { ArrowRight } from 'lucide-react-native';

interface NearestBusCardProps {
  bus: Bus | null;
  eta: ETA | null;
  onDetails: (busId: string) => void;
}

export const NearestBusCard: React.FC<NearestBusCardProps> = ({
  bus,
  eta,
  onDetails,
}) => {
  // Pulsing green dot animation
  const pulseScale = useRef(new Animated.Value(0.95)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 0.95,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: false,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);



  if (!bus) return null;

  const etaMinutes = eta?.etaMinutes ?? 5;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.smallTitle}>Bus más cercano</Text>
      <View style={styles.card}>
        <View style={styles.leftGroup}>
          <View style={styles.routeBadge}>
            <Text style={styles.routeBadgeText}>{bus.routeName}</Text>
          </View>
          <View style={styles.etaContainer}>
            <View style={styles.liveDotContainer}>
              <Animated.View
                style={[
                  styles.liveDotPulse,
                  { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
                ]}
              />
              <View style={styles.liveDotCore} />
            </View>
            <Text style={styles.etaText}>{etaMinutes} min</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onDetails(bus.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.detailsButtonText}>Detalles</Text>
          <ArrowRight size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    zIndex: 30,
  },
  smallTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeBadge: {
    backgroundColor: '#000666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  routeBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDotContainer: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotPulse: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00e475',
  },
  liveDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e475',
  },
  etaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0056c5',
  },
  detailsButton: {
    backgroundColor: '#0056c5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default NearestBusCard;
