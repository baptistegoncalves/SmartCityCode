import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainPopup from "./MainPopup"; // Importez MainPopup

type Camera = {
  nom: string;
  id: string;
  observation?: string;
  gid: string;
  lon: number;
  lat: number;
};

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [cameraLocations, setCameraLocations] = useState<Camera[]>([]);
  const [showCameras, setShowCameras] = useState(false); // Ajouter un état pour gérer l'affichage des caméras

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
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
  }, []);

  // Fonction pour charger les données des caméras depuis l'API
  const loadCamerasFromAPI = async () => {
    try {
      const response = await fetch(
        "https://data.grandlyon.com/fr/datapusher/ws/rdata/pvo_patrimoine_voirie.pvocameracriter/all.json?maxfeatures=-1&start=1"
      );
      const data = await response.json();

      const cameras = data.values.map((camera: any) => ({
        nom: camera.nom,
        id: camera.identifiant,
        observation: camera.observation,
        gid: camera.gid,
        lon: parseFloat(camera.lon),
        lat: parseFloat(camera.lat),
      }));

      setCameraLocations(cameras);
      console.log(cameras);
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  };

  // Gérer l'affichage des caméras
  const toggleCameras = async () => {
    if (!showCameras) {
      await loadCamerasFromAPI(); // Charger les caméras depuis l'API si elles ne sont pas encore affichées
    }
    setShowCameras(!showCameras); // Basculer l'état d'affichage des caméras
  };

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {/* Afficher les marqueurs des caméras si l'état showCameras est activé */}
        {showCameras &&
          cameraLocations.map((camera) => (
            <Marker
              key={camera.id}
              coordinate={{
                latitude: camera.lat,
                longitude: camera.lon,
              }}
              title={`Caméra ${camera.nom}`}
              description={camera.observation || "Aucune description"}
            />
          ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
        <Button
          title={showCameras ? "Masquer les Caméras" : "Voir Caméras"}
          onPress={toggleCameras}
        />
      </View>
      <MainPopup togglePopup={togglePopup} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: width,
    height: height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 250, // Ajustez cette valeur pour positionner le bouton pas trop en bas
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
});

export default MapScreen;
