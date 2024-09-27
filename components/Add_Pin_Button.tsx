import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

export default function Add_Pin_Button({ onAddPin }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pinName, setPinName] = useState(""); // Nom du pin
  const [location, setLocation] = useState(null);
  const [selectedReason, setSelectedReason] = useState("banc"); // Raison par défaut

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de localisation refusée");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    };

    if (modalVisible) {
      getLocation();
    }
  }, [modalVisible]);

  const handlePinConfirmation = () => {
    if (location && pinName) {
      onAddPin({
        name: pinName,
        lat: location.latitude,
        lon: location.longitude,
        reason: selectedReason,
      });

      setPinName("");
      setModalVisible(false);
    } else {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le pin.");
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Ajouter un pin</Text>

            {/* Nom du pin */}
            <TextInput
              placeholder="Nom du pin"
              value={pinName}
              onChangeText={setPinName}
              style={styles.input}
            />

            {/* Picker pour choisir la raison */}
            <Picker
              selectedValue={selectedReason}
              onValueChange={(itemValue) => setSelectedReason(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Banc" value="banc" />
              <Picker.Item label="Fontaine" value="fontaine" />
              <Picker.Item label="Travaux" value="travaux" />
              <Picker.Item label="Autre" value="autre" />
            </Picker>

            {/* Longitude et latitude */}
            {location && (
              <View>
                <Text>Latitude : {location.latitude}</Text>
                <Text>Longitude : {location.longitude}</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handlePinConfirmation}
              >
                <Text style={styles.confirmButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
