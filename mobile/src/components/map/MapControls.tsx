import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Crosshair, Plus, Minus, Bus, MapPin } from 'lucide-react-native';

interface MapControlsProps {
  onMyLocation: () => void;
  onZoomIn?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  showBuses?: boolean;
  showStations?: boolean;
  onToggleBuses?: () => void;
  onToggleStations?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onMyLocation,
  onZoomIn,
  onZoomOut,
  showBuses = true,
  showStations = true,
  onToggleBuses,
  onToggleStations,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onMyLocation}
        activeOpacity={0.8}
      >
        <Crosshair size={22} color="#000666" />
      </TouchableOpacity>

      {onToggleBuses && (
        <TouchableOpacity
          style={[styles.button, !showBuses && styles.buttonInactive]}
          onPress={onToggleBuses}
          activeOpacity={0.8}
        >
          <Bus size={22} color={showBuses ? "#000666" : "#94a3b8"} />
        </TouchableOpacity>
      )}

      {onToggleStations && (
        <TouchableOpacity
          style={[styles.button, !showStations && styles.buttonInactive]}
          onPress={onToggleStations}
          activeOpacity={0.8}
        >
          <MapPin size={22} color={showStations ? "#000666" : "#94a3b8"} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onZoomIn}
        activeOpacity={0.8}
      >
        <Plus size={22} color="#000666" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={onZoomOut}
        activeOpacity={0.8}
      >
        <Minus size={22} color="#000666" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: '50%',
    zIndex: 30,
    gap: 12,
    transform: [{ translateY: -72 }],
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonInactive: {
    backgroundColor: '#f1f5f9',
  },
});

export default MapControls;
