
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
    <View className="flex-1 justify-center items-center bg-green-500">
      <Text className='text-2xl'>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}