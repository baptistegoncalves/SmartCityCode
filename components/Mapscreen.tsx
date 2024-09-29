// MapScreen.tsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Image,
  Text,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import Add_Pin_Button from "./Add_Pin_Button";
import { createClient } from "@supabase/supabase-js";
import PinDetailsPopup from "./PinDetailsPopup";
import AddPinPopup from "./AddPinPopup";

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// Configuration Supabase
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
  const [bottomSheetMode, setBottomSheetMode] = useState<
    "closed" | "pinDetails" | "addPin" | "success"
  >("closed");

  // Référence pour le Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%"], []);

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

      // Surveiller les changements de position
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

  // Fonction pour fermer le Bottom Sheet
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setBottomSheetMode("closed");
    setSelectedPin(null);
  };

  // Fonction pour ouvrir les détails du pin
  const openPinDetails = (pin: Pin) => {
    setSelectedPin(pin);
    setBottomSheetMode("pinDetails");
    bottomSheetRef.current?.snapToIndex(0);
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
        closeBottomSheet();
      }
    }
  };

  // Fonction pour gérer l'ajout d'un nouveau pin
  const handleAddPin = async (
    name: string,
    reason: string,
    location: Location.LocationObject
  ) => {
    const newPin = {
      name,
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      reason,
    };
    try {
      const { data, error } = await supabase
        .from("PinUser")
        .insert([
          {
            lat: newPin.lat,
            lon: newPin.lon,
            reason: newPin.reason,
            name: newPin.name,
          },
        ])
        .select();
      if (error) {
        throw new Error(
          "Erreur lors de l'ajout du pin dans la base de données"
        );
      }
      const [insertedPin] = data;
      setPins((prevPins) => [...prevPins, insertedPin]);
      setBottomSheetMode("success");
      setTimeout(() => {
        closeBottomSheet();
      }, 1500);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le pin.");
      console.error(err);
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
          closeBottomSheet();
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
        <Add_Pin_Button
          onPress={() => {
            setBottomSheetMode("addPin");
            bottomSheetRef.current?.snapToIndex(0);
          }}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        style={[styles.bottomSheet, { zIndex: 10, elevation: 10 }]}
        onClose={() => setBottomSheetMode("closed")}
      >
        {bottomSheetMode === "pinDetails" && selectedPin && (
          <PinDetailsPopup
            selectedPin={selectedPin}
            deletePin={deletePin}
            closeBottomSheet={closeBottomSheet}
          />
        )}

        {bottomSheetMode === "addPin" && (
          <AddPinPopup
            handleAddPin={handleAddPin}
            closeBottomSheet={closeBottomSheet}
          />
        )}

        {bottomSheetMode === "success" && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.chevronContainer}>
              <View style={styles.chevron} />
            </View>
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
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>
                📍 Pin ajouté avec succès
              </Text>
            </View>
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
    alignItems: "center",
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
  successMessageContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  successMessageText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
});
