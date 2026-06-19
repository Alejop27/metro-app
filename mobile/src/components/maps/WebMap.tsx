import React from 'react';
import { View, Text } from 'react-native';

export const WebMap = (props: any) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>WebMap is not supported on Native. Use MapView.</Text>
    </View>
  );
};

export default WebMap;
