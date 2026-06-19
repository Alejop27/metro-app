import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { BusDetailsScreen } from '../screens/BusDetailsScreen';
import { LoadingView } from '../components/ui/LoadingView';
import { View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingView message="Iniciando Metrolínea Smart..." fullScreen={true} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen 
              name="BusDetails" 
              component={BusDetailsScreen} 
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
});

export default AppNavigator;
