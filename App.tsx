<<<<<<< HEAD
import * as React from "react";
import { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./components/Mapscreen"; // Assurez-vous que le nom du fichier est correct
import Login from "./components/Login";
import MainPopup from './components/MainPopup';
type RootStackParamList = {
  Login: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Map" component={MapScreen} />
        <MainPopup isOpen={isPopupOpen} togglePopup={togglePopup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;