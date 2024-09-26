import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Add_Pin_Button from './Add_Pin_Button'; // Assurez-vous que le chemin vers votre fichier est correct
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// Supabase configuration
const supabaseUrl = 'https://tpzxhsjdxvqoroyflzpq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenhoc2pkeHZxb3JveWZsenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNTY5MTksImV4cCI6MjA0MjkzMjkxOX0.SEq5hD2kohn-WxXE1VUXA6MKvnr9ev-9Sqz3M-2ciVQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MapScreen() {
  const [pins, setPins] = useState([]);
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);

  // Fonction pour récupérer les pins de Supabase
  const fetchPins = async () => {
    const { data, error } = await supabase
      .from('PinUser')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des pins:', error.message);
    } else {
      setPins(data);
    }
  };

  useEffect(() => {
    // Récupérer la localisation de l'utilisateur
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de localisation refusée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      // Surveiller les changements de position en temps réel
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    })();

    // Charger les pins depuis Supabase
    fetchPins();
  }, []);

  // Fonction pour recentrer la carte sur la position actuelle
  const centerMap = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: parseFloat(pin.lat),
              longitude: parseFloat(pin.lon),
            }}
            title={pin.reason}
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
        <Add_Pin_Button />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60, // Ajustez cette valeur pour positionner le bouton pas trop en bas
    left: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // Assurez-vous que le bouton est au-dessus de la carte
  },
});
