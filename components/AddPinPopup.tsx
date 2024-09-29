// AddPinPopup.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";

type AddPinPopupProps = {
  handleAddPin: (
    name: string,
    reason: string,
    location: Location.LocationObject
  ) => void;
  closeBottomSheet: () => void;
};

const AddPinPopup: React.FC<AddPinPopupProps> = ({
  handleAddPin,
  closeBottomSheet,
}) => {
  const [newPinName, setNewPinName] = useState("");
  const [newPinReason, setNewPinReason] = useState("banc");
  const [addPinLocation, setAddPinLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de localisation refusée");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setAddPinLocation(loc);
    };
    getLocation();
  }, []);

  const onAddPin = () => {
    if (addPinLocation && newPinName) {
      handleAddPin(newPinName, newPinReason, addPinLocation);
      setNewPinName("");
      setNewPinReason("banc");
      setAddPinLocation(null);
    } else {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le pin.");
    }
  };

  return (
    <View style={styles.bottomSheetContent}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#aaa"
        />
        <Image
          source={require("../assets/ImageBaptiste/LuffyAvatar.jpeg")}
          style={styles.avatar}
        />
      </View>

      {/* Formulaire d'ajout de pin */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <FontAwesome name="plus" size={24} color="white" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Ajouter un Pin 📍</Text>
        </View>

        {/* Champs du formulaire */}
        <View style={styles.cardContent}>
          {/* Nom */}
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Nom :</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="Entrez le nom du pin"
              value={newPinName}
              onChangeText={setNewPinName}
            />
          </View>

          {addPinLocation && (
            <View style={styles.row}>
              <Text style={styles.cardLabel}>Longitude :</Text>
              <Text style={styles.cardValue}>
                {addPinLocation.coords.longitude}
              </Text>
            </View>
          )}

          {addPinLocation && (
            <View style={styles.row}>
              <Text style={styles.cardLabel}>Latitude :</Text>
              <Text style={styles.cardValue}>
                {addPinLocation.coords.latitude}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.cardLabel}>Raison :</Text>
            <Picker
              selectedValue={newPinReason}
              onValueChange={(itemValue) => setNewPinReason(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Banc" value="banc" />
              <Picker.Item label="Fontaine" value="fontaine" />
              <Picker.Item label="Travaux" value="travaux" />
              <Picker.Item label="Autre" value="autre" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Bouton Valider */}
      <TouchableOpacity style={styles.validateButton} onPress={onAddPin}>
        <Text style={styles.validateButtonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chevronContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  chevron: {
    width: 40,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 2.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  iconBackground: {
    backgroundColor: "#D1C4E9",
    padding: 10,
    borderRadius: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  cardContent: {
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  cardValue: {
    color: "#777",
    flex: 2,
    textAlign: "right",
  },
  cardInput: {
    flex: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    textAlign: "right",
  },
  picker: {
    flex: 2,
    height: 50,
  },
  validateButton: {
    backgroundColor: "rgba(66, 133, 244, 0.25)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  validateButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
  },
});

export default AddPinPopup;
