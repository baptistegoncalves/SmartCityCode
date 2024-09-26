import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Asset } from 'expo-asset';

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


  const loadCamerasFromJSON = async () => {
    try {
      const results: Camera[] = require('../assets/datasets/Camera_Lyon_lon_lat.json'); // Charger directement le fichier JSON
      setCameraLocations(results);
      console.log(results); // Vérifier les données chargées
    } catch (error) {
      console.error('Error loading JSON file:', error);
    }
  };

  useEffect(() => {
    loadCamerasFromJSON(); // Charger les données JSON lorsque le composant est monté
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
            title={`Caméra ${camera.id}`}
            description={camera.observation || 'Aucune description'}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Recharger les caméras" onPress={loadCamerasFromJSON} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
});

export default CameraMap;