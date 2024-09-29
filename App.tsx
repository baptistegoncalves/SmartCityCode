import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import CameraMap from "./components/CameraMap"; // Assurez-vous que ce chemin est correct
import Login from "./components/Login";
import MapScreen from "./components/Mapscreen"; // Assurez-vous que le nom du fichier est correct

// Déclarez tous les écrans que vous allez utiliser dans le navigateur
type RootStackParamList = {
  Login: undefined;
  Map: undefined;
  CameraMap: undefined; // Ajoutez CameraMap ici
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="CameraMap" component={CameraMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
