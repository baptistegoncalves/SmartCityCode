import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/HomeScreen_vanto";
import MapScreen from "./components/Mapscreen";
import CameraMap from "./components/Cameramap"; // Assurez-vous que ce chemin est correct

// Déclarez tous les écrans que vous allez utiliser dans le navigateur
type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  CameraMap: undefined; // Ajoutez CameraMap ici
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="CameraMap" component={CameraMap} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
