import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Alert } from '../../types';
import { ShieldAlert, AlertTriangle, Info, Clock, CheckCircle } from 'lucide-react-native';

interface AlertCardProps {
  alert: Alert;
  onResolve?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onResolve,
}) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          border: '#EF4444',
          bg: '#EF444410',
          text: '#FCA5A5',
          icon: <ShieldAlert size={20} color="#EF4444" />,
        };
      case 'WARNING':
        return {
          border: '#F59E0B',
          bg: '#F59E0B10',
          text: '#FCD34D',
          icon: <AlertTriangle size={20} color="#F59E0B" />,
        };
      default:
        return {
          border: '#38BDF8',
          bg: '#38BDF810',
          text: '#BAE6FD',
          icon: <Info size={20} color="#38BDF8" />,
        };
    }
  };

  const styleConfig = getSeverityStyle(alert.severity);

  const getFormattedTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const minutesAgo = Math.floor((Date.now() - date.getTime()) / 60000);
      if (minutesAgo < 1) return 'Hace un momento';
      if (minutesAgo < 60) return `Hace ${minutesAgo} min`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      if (hoursAgo < 24) return `Hace ${hoursAgo} h`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.card, { borderColor: styleConfig.border, backgroundColor: styleConfig.bg }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {styleConfig.icon}
          <Text style={[styles.title, { color: styleConfig.text }]}>{alert.title}</Text>
        </View>
        
        {onResolve && alert.active && (
          <TouchableOpacity onPress={onResolve} style={styles.resolveButton}>
            <CheckCircle size={16} color="#10B981" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message}>{alert.message}</Text>

      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Clock size={12} color="#64748B" style={styles.clockIcon} />
          <Text style={styles.timeText}>{getFormattedTime(alert.timestamp)}</Text>
        </View>
        
        {alert.routeId && (
          <View style={styles.routeBadge}>
            <Text style={styles.routeText}>Ruta: {alert.routeId.replace('rt_', '').toUpperCase()}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  resolveButton: {
    padding: 4,
  },
  message: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#33415533',
    paddingTop: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  routeBadge: {
    backgroundColor: '#0B0F19',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  routeText: {
    fontSize: 10,
    color: '#F8FAFC',
    fontWeight: '700',
  },
});
export default AlertCard;
