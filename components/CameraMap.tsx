import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Camera {
  nom: string;
  id: string;
  observation?: string;
  gid: string;
  lon: number;
  lat: number;
}

const CameraMap: React.FC = () => {
  const [cameraLocations, setCameraLocations] = useState<Camera[]>([]);

  // Fonction pour charger les données des caméras depuis l'API
  const loadCamerasFromAPI = async () => {
    try {
      const response = await fetch(
        "https://data.grandlyon.com/fr/datapusher/ws/rdata/pvo_patrimoine_voirie.pvocameracriter/all.json?maxfeatures=-1&start=1"
      );
      const data = await response.json();
      // Récupérer les données pertinentes et les stocker dans le state
      const cameras = data.values.map((camera: any) => ({
        nom: camera.nom,
        id: camera.identifiant, // Assure que cela correspond au champ de l'API
        observation: camera.observation,
        gid: camera.gid,
        lon: parseFloat(camera.lon),
        lat: parseFloat(camera.lat),
      }));
      setCameraLocations(cameras);
      console.log(cameras); // Vérifier les données chargées
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  };

  useEffect(() => {
    loadCamerasFromAPI(); // Charger les données de l'API lorsque le composant est monté
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.75,
          longitude: 4.85,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Affichage des marqueurs */}
        {cameraLocations.map((camera) => (
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
        <Button title="Recharger les caméras" onPress={loadCamerasFromAPI} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "90%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
});

export default CameraMap;
