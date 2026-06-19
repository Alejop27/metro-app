import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { useAuthStore } from '../store/authStore';
import { Bus, Key, Mail, Sparkles } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { loginMock, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('El correo electrónico es requerido');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await loginMock();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo Header */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Bus size={48} color="#ffffff" />
            <View style={styles.sparkleBadge}>
              <Sparkles size={16} color="#FFE600" />
            </View>
          </View>
          <Text style={styles.title}>Metrolínea Smart</Text>
          <Text style={styles.subtitle}>Portal de Movilidad e Inteligencia Predictiva</Text>
        </View>

        {/* Login Box */}
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardSubtitle}>
            Accede al mapa de buses en tiempo real y recibe predicciones de llegadas con IA.
          </Text>

          <AppInput
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            icon={<Mail size={18} color="#64748B" />}
          />

          <AppInput
            label="Contraseña"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry={true}
            icon={<Key size={18} color="#64748B" />}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <AppButton
            title="Ingresar al Sistema"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.submitBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desarrollado para Hackathon Metropolitana 2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FF5E13',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#FF5E13',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1E293B',
    padding: 6,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FF5E13',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 18,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#222F4C',
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 24,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
export default LoginScreen;
