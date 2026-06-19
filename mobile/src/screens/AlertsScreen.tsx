import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, Alert as NativeAlert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '../components/ui/Header';
import { AlertCard } from '../components/cards/AlertCard';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { useAlertStore } from '../store/alertStore';
import { useTransportStore } from '../store/transportStore';
import { AlertType, AlertSeverity } from '../types';
import { Plus, X, BellOff, ShieldAlert, Check } from 'lucide-react-native';

// Form validation schema with Zod
const alertFormSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type: z.enum(['CONGESTION', 'DELAY', 'ACCIDENT', 'ROUTE_CHANGE', 'SUSPENSION']),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  routeId: z.string().optional(),
});

type AlertFormInputs = z.infer<typeof alertFormSchema>;

export const AlertsScreen: React.FC = () => {
  const { alerts, addAlert, resolveAlert } = useAlertStore();
  const { routes } = useTransportStore();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlertFormInputs>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'CONGESTION',
      severity: 'WARNING',
      routeId: '',
    },
  });

  const onSubmit = async (data: AlertFormInputs) => {
    try {
      // Simulate API submit delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addAlert({
        title: data.title,
        message: data.message,
        type: data.type,
        severity: data.severity,
        routeId: data.routeId || undefined,
      });

      setModalVisible(false);
      reset();
      NativeAlert.alert('Éxito', 'Tu reporte de tránsito ha sido publicado y está visible para otros usuarios.');
    } catch (e) {
      NativeAlert.alert('Error', 'No se pudo publicar el reporte en este momento.');
    }
  };

  const handleResolveAlert = (id: string) => {
    resolveAlert(id);
  };

  const activeAlerts = alerts.filter(a => a.active);

  return (
    <View style={styles.container}>
      <Header 
        title="Alertas de Tránsito" 
        rightAction={
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addIconBtn}>
            <Plus size={22} color="#0ea5e9" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={activeAlerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AlertCard 
            alert={item} 
            onResolve={() => handleResolveAlert(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellOff size={48} color="#64748B" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>¡Todo despejado!</Text>
            <Text style={styles.emptySubtitle}>
              No hay alertas activas en el sistema de transporte. Buen viaje.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Report Alert Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reportar Novedad en Vía</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              {/* Alert Type selection */}
              <Text style={styles.dropdownLabel}>Tipo de Novedad</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectorRow}>
                    {(['CONGESTION', 'DELAY', 'ACCIDENT', 'SUSPENSION'] as AlertType[]).map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => onChange(type)}
                        style={[
                          styles.selectorItem,
                          value === type && styles.selectorItemActive
                        ]}
                      >
                        <Text style={[styles.selectorText, value === type && styles.selectorTextActive]}>
                          {type === 'CONGESTION' ? 'Trafico' : type === 'DELAY' ? 'Retraso' : type === 'ACCIDENT' ? 'Choque' : 'Cierre'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />

              {/* Severity Selection */}
              <Text style={styles.dropdownLabel}>Severidad</Text>
              <Controller
                control={control}
                name="severity"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.selectorRow}>
                    {(['INFO', 'WARNING', 'CRITICAL'] as AlertSeverity[]).map((severity) => (
                      <TouchableOpacity
                        key={severity}
                        onPress={() => onChange(severity)}
                        style={[
                          styles.selectorItem,
                          value === severity && styles.selectorItemActive,
                          value === severity && severity === 'CRITICAL' && styles.selectorDangerActive
                        ]}
                      >
                        <Text style={[styles.selectorText, value === severity && styles.selectorTextActive]}>
                          {severity === 'INFO' ? 'Informativo' : severity === 'WARNING' ? 'Moderado' : 'Crítico'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />

              {/* Route reference Dropdown */}
              <Text style={styles.dropdownLabel}>Ruta Afectada (Opcional)</Text>
              <Controller
                control={control}
                name="routeId"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.routeDropdown}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity
                        onPress={() => onChange('')}
                        style={[styles.routeSelectItem, value === '' && styles.routeSelectActive]}
                      >
                        <Text style={styles.routeSelectText}>Ninguna</Text>
                      </TouchableOpacity>
                      {routes.map((rt) => (
                        <TouchableOpacity
                          key={rt.id}
                          onPress={() => onChange(rt.id)}
                          style={[styles.routeSelectItem, value === rt.id && styles.routeSelectActive]}
                        >
                          <Text style={styles.routeSelectText}>{rt.name.split(' - ')[0]}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              />

              {/* Title Input */}
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    label="Título del Reporte"
                    placeholder="Ej. Retraso por manifestación vial"
                    value={value}
                    onChangeText={onChange}
                    error={errors.title?.message}
                  />
                )}
              />

              {/* Message Input */}
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    label="Descripción detallada"
                    placeholder="Explica qué está sucediendo en el punto vial..."
                    value={value}
                    onChangeText={onChange}
                    error={errors.message?.message}
                    style={styles.multilineInput}
                  />
                )}
              />

              {/* Submit Button */}
              <AppButton
                title="Publicar Reporte"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                style={styles.submitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  addIconBtn: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 88,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FF5E13',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 25, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    borderWidth: 1.5,
    borderColor: '#222F4C',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222F4C',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 4,
  },
  formContainer: {
    padding: 18,
  },
  dropdownLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  selectorItem: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#334155',
    borderWidth: 1,
  },
  selectorItemActive: {
    backgroundColor: '#0ea5e91A',
    borderColor: '#0ea5e9',
  },
  selectorDangerActive: {
    backgroundColor: '#EF44441A',
    borderColor: '#EF4444',
  },
  selectorText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  selectorTextActive: {
    color: '#F8FAFC',
  },
  routeDropdown: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  routeSelectItem: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  routeSelectActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#0ea5e920',
  },
  routeSelectText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  multilineInput: {
    minHeight: 80,
  },
  submitBtn: {
    marginTop: 12,
    marginBottom: 24,
  },
});
export default AlertsScreen;
