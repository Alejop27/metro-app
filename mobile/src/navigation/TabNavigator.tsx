import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, StyleSheet } from 'react-native';
import { RootTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import RoutesScreen from '../screens/RoutesScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Map, Route, Bot, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** Active tab pill highlight */
const ActiveTabIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <View style={tabStyles.activePill}>{icon}</View>
);

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8690ee',      // on-primary-container
        tabBarInactiveTintColor: '#454652',    // on-surface-variant
        tabBarStyle: {
          backgroundColor: '#ffffff',           // surface-container-lowest
          borderTopColor: '#c6c5d4',            // outline-variant
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={({ route, navigation }) => ({
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ActiveTabIcon icon={<Map size={22} color="#8690ee" />} />
            ) : (
              <Map size={22} color={color} />
            ),
          tabBarActiveTintColor: '#8690ee',
        })}
      />
      <Tab.Screen
        name="Rutas"
        component={RoutesScreen}
        options={{
          tabBarLabel: 'Rutas',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ActiveTabIcon icon={<Route size={22} color="#8690ee" />} />
            ) : (
              <Route size={22} color={color} />
            ),
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Asistente',
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <ActiveTabIcon icon={<Bot size={22} color="#8690ee" />} />
            ) : (
              <Bot size={22} color={color} />
            ),
        }}
      />

    </Tab.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  activePill: {
    backgroundColor: '#1a237e',   // primary-container
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;
