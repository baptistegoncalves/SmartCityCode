import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

const Add_Pin_Button = ({ onAddPin }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [reason, setReason] = useState(""); // Pour stocker la raison sélectionnée
  const [modalVisible, setModalVisible] = useState(false); // Pour gérer la visibilité du modal

  const getLocation = async () => {
    // Demande de permission d'accès à la géolocalisation
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    // Obtention de la position actuelle
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    setModalVisible(true); // Afficher le modal pour la sélection de raison
  };

  const insertDataToSupabase = async () => {
    if (location && reason) {
      const newPin = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        reason: reason,
      };

      // Appel de la fonction onAddPin pour ajouter un pin localement
      onAddPin(newPin);

      setModalVisible(false);
      setReason(""); // Réinitialiser la raison pour la prochaine utilisation
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionnez une raison</Text>

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

            <View style={styles.buttonContainer}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Confirmer" onPress={insertDataToSupabase} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plusSign: {
    fontSize: 30,
    color: "black",
  },
  coords: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    height: 400,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between", // Répartir l'espace entre les éléments du modal
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    height: 44,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Espacer les boutons "Annuler" et "Confirmer"
    width: "100%",
    marginTop: "auto", // Pousse le conteneur de boutons en bas
    marginBottom: 10, // Marge en bas du modal pour espacer des bords
  },
});

export default Add_Pin_Button;
