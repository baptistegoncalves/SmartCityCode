import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/HomeScreen_vanto";
import MapScreen from "./components/Mapscreen"; // Assurez-vous que le nom du fichier est correct
import { SafeAreaView, StatusBar } from 'react-native';
import Login from './components/Login';
type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Login />
    </SafeAreaView>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
