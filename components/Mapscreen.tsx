import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import Add_Pin_Button from "./Add_Pin_Button";
import { createClient } from "@supabase/supabase-js";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// Supabase configuration
const supabaseUrl = "https://tpzxhsjdxvqoroyflzpq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenhoc2pkeHZxb3JveWZsenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNTY5MTksImV4cCI6MjA0MjkzMjkxOX0.SEq5hD2kohn-WxXE1VUXA6MKvnr9ev-9Sqz3M-2ciVQ"; // Remplacez par votre clé Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Types pour les pins et la localisation
type Pin = {
  id: number | string;
  lat: number;
  lon: number;
  name: string;
  reason: string;
};

type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export default function MapScreen() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);

  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  // Référence pour le Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%"], []); // Modifié pour remonter le BottomSheet

  // Fonction pour récupérer les pins de Supabase
  const fetchPins = async () => {
    const { data, error } = await supabase.from("PinUser").select("*");

    if (error) {
      console.error("Erreur lors de la récupération des pins:", error.message);
    } else if (data) {
      setPins(data);
    }
  };

  useEffect(() => {
    // Récupérer la localisation de l'utilisateur
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de localisation refusée");
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
  const addPin = async (newPin: Omit<Pin, "id">) => {
    try {
      const { data, error } = await supabase
        .from("PinUser")
        .insert([
          {
            lat: newPin.lat,
            lon: newPin.lon,
            reason: newPin.reason,
            name: newPin.name, // Inclure le nom du pin
          },
        ])
        .select(); // Sélectionner l'élément inséré pour récupérer son ID

      if (error) {
        throw new Error(
          "Erreur lors de l'ajout du pin dans la base de données"
        );
      }

      const [insertedPin] = data;
      setPins((prevPins) => [...prevPins, insertedPin]);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le pin.");
      console.error(err);
    }
  };

  // Fonction pour ouvrir le Bottom Sheet avec les détails du pin
  const openPinDetails = (pin: Pin) => {
    setSelectedPin(pin);
    bottomSheetRef.current?.snapToIndex(0); // Ouvre le Bottom Sheet
  };

  // Fonction pour supprimer un pin
  const deletePin = async () => {
    if (selectedPin) {
      const { error } = await supabase
        .from("PinUser")
        .delete()
        .eq("id", selectedPin.id);

      if (error) {
        console.error("Erreur lors de la suppression du pin:", error.message);
        Alert.alert("Erreur", "Impossible de supprimer le pin.");
      } else {
        setPins((prevPins) =>
          prevPins.filter((pin) => pin.id !== selectedPin.id)
        );
        bottomSheetRef.current?.close(); // Fermer le Bottom Sheet après la suppression
        setSelectedPin(null);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <MapView
        style={[styles.map, { zIndex: 0 }]}
        region={region || undefined}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        onPress={() => {
          bottomSheetRef.current?.close();
        }}
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.lat,
              longitude: pin.lon,
            }}
            title={pin.name}
            description={pin.reason}
            onPress={() => openPinDetails(pin)}
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Recentrer" onPress={centerMap} />
      </View>
      <View style={styles.buttonContainer}>
        <Add_Pin_Button onAddPin={addPin} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Caché par défaut
        snapPoints={snapPoints} // Hauteur augmentée à 80%
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        style={[styles.bottomSheet, { zIndex: 10, elevation: 10 }]}
      >
        {selectedPin && (
          <View style={styles.bottomSheetContent}>
            {/* Chevron */}
            <View style={styles.chevronContainer}></View>

            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher..."
                placeholderTextColor="#aaa"
              />
              <Image
                source={require("../assets/ImageBaptiste/LuffyAvatar.jpeg")} // Remplacez par le chemin de votre image
                style={styles.avatar}
              />
            </View>

            {/* Carte d'information */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconBackground}>
                    <FontAwesome name="home" size={24} color="blue" />
                  </View>
                </View>
                <Text style={styles.cardTitle}>{selectedPin.name}</Text>
                <Text style={styles.pinTitle}>📍</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.row}>
                  <Text style={styles.cardLabel}>Nom :</Text>
                  <Text style={styles.cardValue}>{selectedPin.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cardLabel}>Longitude :</Text>
                  <Text style={styles.cardValue}>{selectedPin.lon}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cardLabel}>Latitude :</Text>
                  <Text style={styles.cardValue}>{selectedPin.lat}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.cardLabel}>Raison :</Text>
                  <TouchableOpacity>
                    <Text style={styles.cardLink}>{selectedPin.reason}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bouton Supprimer */}
            <TouchableOpacity style={styles.deleteButton} onPress={deletePin}>
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: width,
    height: height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F9F9F9",
  },
  bottomSheet: {
    zIndex: 2,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chevronContainer: {
    alignItems: "center",
    marginVertical: 5,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Blanc avec opacité réduite
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
    backgroundColor: "rgba(66, 133, 244, 0.2)", // Bleu avec opacité réduite
    padding: 10,
    borderRadius: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  pinTitle: {
    fontSize: 25,
  },
  cardContent: {
    marginTop: 15,
  },
  row: {
    flexDirection: "row", // Aligner les éléments sur la même ligne
    justifyContent: "space-between", // Espacer les éléments
    alignItems: "center",
    marginBottom: 10, // Espacement entre les lignes
  },
  cardLabel: {
    fontWeight: "bold",
    flex: 1,
  },
  cardValue: {
    color: "#777",
    flex: 2,
    textAlign: "right", // Aligner le texte à droite pour le rendre uniforme
  },
  cardLink: {
    color: "blue",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "rgba(255, 0, 0, 0.15)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    opacity: 0.8,
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});
