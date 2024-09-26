import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Modal, Text, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Add_Pin_Button from './Add_Pin_Button';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// Supabase configuration
const supabaseUrl = 'https://tpzxhsjdxvqoroyflzpq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenhoc2pkeHZxb3JveWZsenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNTY5MTksImV4cCI6MjA0MjkzMjkxOX0.SEq5hD2kohn-WxXE1VUXA6MKvnr9ev-9Sqz3M-2ciVQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Types pour les pins et la localisation
type Pin = {
  id: number | string;
  lat: number;
  lon: number;
  reason: string;
};

type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export default function MapScreen() {
  const [pins, setPins] = useState<Pin[]>([]); // Initialisation avec un tableau de type Pin
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);

  const [selectedPin, setSelectedPin] = useState<Pin | null>(null); // Stocker le pin sélectionné
  const [modalVisible, setModalVisible] = useState(false); // Contrôler la visibilité du modal de suppression

  // Fonction pour récupérer les pins de Supabase
  const fetchPins = async () => {
    const { data, error } = await supabase
      .from('PinUser')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des pins:', error.message);
    } else if (data) {
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

  // Fonction pour ajouter un pin dans la base de données puis l'ajouter localement
  const addPin = async (newPin: Omit<Pin, 'id'>) => {
    try {
      // 1. Envoyer les données à la base de données Supabase
      const { data, error } = await supabase
        .from('PinUser')
        .insert([{ lat: newPin.lat, lon: newPin.lon, reason: newPin.reason }])
        .select(); // Sélectionner l'élément inséré pour récupérer son ID

      if (error) {
        throw new Error('Erreur lors de l\'ajout du pin dans la base de données');
      }

      // 2. Ajouter le pin avec l'ID réel renvoyé par la base de données
      const [insertedPin] = data;
      setPins((prevPins) => [...prevPins, insertedPin]);

    } catch (err) {
      // Afficher une alerte en cas d'erreur
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le pin.");
      console.error(err);
    }
  };

  // Fonction pour ouvrir le modal avec les détails du pin
  const openPinDetails = (pin: Pin) => {
    setSelectedPin(pin); // Enregistrer le pin sélectionné
    setModalVisible(true); // Afficher le modal
  };

  // Fonction pour supprimer un pin
  const deletePin = async () => {
    if (selectedPin) {
      const { error } = await supabase.from('PinUser').delete().eq('id', selectedPin.id);

      if (error) {
        console.error("Erreur lors de la suppression du pin:", error.message);
        Alert.alert("Erreur", "Impossible de supprimer le pin.");
      } else {
        // Supprimer localement
        setPins((prevPins) => prevPins.filter((pin) => pin.id !== selectedPin.id));
        setModalVisible(false); // Fermer le modal après la suppression
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        region={region || undefined}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.lat,
              longitude: pin.lon,
            }}
            title={pin.reason}
            onPress={() => openPinDetails(pin)} // Ouvrir le modal avec les détails du pin
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
        <Add_Pin_Button onAddPin={addPin} />
      </View>

      {/* Modal pour afficher les détails du pin sélectionné */}
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {selectedPin && (
              <>
                <Text style={styles.modalTitle}>Détails du pin</Text>
                <Text>Latitude: {selectedPin.lat}</Text>
                <Text>Longitude: {selectedPin.lon}</Text>
                <Text>Raison: {selectedPin.reason}</Text>

                <View style={styles.buttonContainer}>
                  <Button title="Supprimer" onPress={deletePin} />
                  <Button title="Ok" onPress={() => setModalVisible(false)} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    bottom: 60,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
