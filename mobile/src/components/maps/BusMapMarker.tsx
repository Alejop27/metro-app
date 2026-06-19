import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { BusFront } from 'lucide-react-native';
import { Bus } from '../../types';

interface BusMapMarkerProps {
  bus: Bus;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  isSelected: boolean;
  onPress: (busId: string) => void;
  animationDelay?: number;
  routeColor?: string;
}

export const BusMapMarker: React.FC<BusMapMarkerProps> = ({
  bus,
  x,
  y,
  isSelected,
  onPress,
  animationDelay = 0,
  routeColor = '#000666',
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1.15 : 1)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          delay: animationDelay,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [animationDelay]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.15 : 1,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  return (
    <TouchableOpacity
      onPress={() => onPress(bus.id)}
      style={[styles.container, { left: `${x}%` as any, top: `${y}%` as any }]}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.markerWrapper,
          { transform: [{ translateY: floatAnim }, { scale: scaleAnim }] },
        ]}
      >
        {/* Route label */}
        <View style={[styles.label, isSelected && styles.labelSelected]}>
          <Text style={styles.labelText}>{bus.routeName}</Text>
        </View>

        <View style={styles.busMarkerWrapper}>
          <View style={[styles.directionArrow, { transform: [{ rotate: `${bus.heading}deg` }] }]}>
            <View style={styles.arrowHead} />
          </View>
          <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected, { backgroundColor: routeColor }]}>
            <BusFront size={20} color="#ffffff" />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  markerWrapper: {
    alignItems: 'center',
  },
  label: {
    backgroundColor: '#0056c5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  labelSelected: {
    backgroundColor: '#000666',
  },
  labelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#000666',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 6,
  },
  iconCircleSelected: {
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

export default BusMapMarker;
