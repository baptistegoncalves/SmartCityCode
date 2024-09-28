import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DataLoader from './components/DataLoader'; 

type RootStackParamList = {
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={DataLoader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
