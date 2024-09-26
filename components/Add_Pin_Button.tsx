import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Button } from 'react-native';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = 'https://tpzxhsjdxvqoroyflzpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenhoc2pkeHZxb3JveWZsenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNTY5MTksImV4cCI6MjA0MjkzMjkxOX0.SEq5hD2kohn-WxXE1VUXA6MKvnr9ev-9Sqz3M-2ciVQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Add_Pin_Button = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [reason, setReason] = useState(''); // Pour stocker la raison sélectionnée
  const [modalVisible, setModalVisible] = useState(false); // Pour gérer la visibilité du modal

  const getLocation = async () => {
    // Demande de permission d'accès à la géolocalisation
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    // Obtention de la position actuelle
    let loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    // Mise à jour de l'état avec la position actuelle
    setLocation(loc);
    setModalVisible(true); // Afficher le modal pour la sélection de raison
  };

  const insertDataToSupabase = async () => {
    if (location && reason) {
      // Envoi des données à la base de données Supabase
      const { data, error } = await supabase
        .from('PinUser') // Nom de la table
        .insert([{ lat: location.coords.latitude, lon: location.coords.longitude, reason }]);

      if (error) {
        console.error('Erreur lors de l\'insertion dans Supabase:', error);
      } else {
        console.log('Données insérées avec succès dans Supabase:', data);
      }

      // Fermer le modal après l'insertion
      setModalVisible(false);
    } else {
      console.log('Localisation ou raison manquante.');
    }
  };

  const cancelPin = () => {
    // Fermer le modal et réinitialiser la raison si l'utilisateur annule
    setReason('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>

      {/* Modal pour la sélection de la raison */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelPin}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionner une raison</Text>
            <View style={styles.buttonContainer}>
              <Button title="Annuler" onPress={cancelPin} color="red" />
              <Button title="Valider" onPress={insertDataToSupabase} />
            </View>
            <Picker
              selectedValue={reason}
              onValueChange={(itemValue) => setReason(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Banc" value="banc" />
              <Picker.Item label="Travaux" value="travaux" />
              <Picker.Item label="Fontaine" value="fontaine" />
              <Picker.Item label="Regroupement" value="regroupement" />
            </Picker>

          </View>
        </View>
      </Modal>

      {location && (
        <View style={styles.coords}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plusSign: {
    fontSize: 30,
    color: 'black',
  },
  coords: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300, // Largeur inchangée
    height: 400, // Hauteur augmentée
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
  picker: {
    width: '100%', // Prend toute la largeur du modal
    height: 44,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default Add_Pin_Button;
