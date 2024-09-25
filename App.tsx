import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Login from './components/Login';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Login />
    </SafeAreaView>
  );
};

export default App;
