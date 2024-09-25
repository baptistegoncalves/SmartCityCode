import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MainPopup from './components/MainPopup';
import backgroundImage from './assets/images_Popup/background.jpg';

const App = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <MainPopup isOpen={isPopupOpen} togglePopup={togglePopup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
});

export default App;
