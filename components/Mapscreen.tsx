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

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [cameraLocations, setCameraLocations] = useState<Camera[]>([]);
  const [showCameras, setShowCameras] = useState(false); // Ajouter un état pour gérer l'affichage des caméras

  // Charger la localisation actuelle
  useEffect(() => {
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

  // Fonction pour charger les données des caméras depuis un fichier JSON
  const loadCamerasFromJSON = async () => {
    try {
      const results: Camera[] = require('../assets/datasets/Camera_Lyon_lon_lat.json'); // Charger le JSON localement
      setCameraLocations(results);
      console.log(results);
    } catch (error) {
      console.error("Error loading JSON file:", error);
    }
  };

  // Gérer l'affichage des caméras
  const toggleCameras = async () => {
    if (!showCameras) {
      await loadCamerasFromJSON(); // Charger les caméras si elles ne sont pas encore affichées
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
              title={`Caméra ${camera.id}`}
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
    bottom: 60,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
});

export default MapScreen;
