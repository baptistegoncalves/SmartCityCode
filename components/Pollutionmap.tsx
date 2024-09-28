import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';

interface PollutionData {
  gid: number;
  identifiant: number;
  nom: string;
  lat: number;
  lon: number;
  observation: string;
  libellelong: string;
  // Ajouter d'autres champs si nécessaire
}

const PollutionMap: React.FC = () => {
  const [pollutionZones, setPollutionZones] = useState<PollutionData[]>([]);

  const fetchPollutionData = async () => {
    try {
      const response = await fetch(
        'https://data.grandlyon.com/fr/datapusher/ws/rdata/pvo_patrimoine_voirie.pvocameracriter/all.json?maxfeatures=-1&start=1'
      );
      const data = await response.json();
      setPollutionZones(data.values); // On récupère les données dans le champ "values"
    } catch (error) {
      console.error('Error fetching pollution data:', error);
    }
  };

  useEffect(() => {
    fetchPollutionData(); // Charger les données de pollution quand le composant est monté
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
        {/* Afficher les zones de pollution en cercle */}
        {pollutionZones.map((zone) => (
          <Circle
            key={zone.gid}
            center={{
              latitude: zone.lat,
              longitude: zone.lon,
            }}
            radius={1000} // Rayon en mètres, ajustez selon vos besoins
            strokeColor="rgba(0, 128, 255, 0.8)" // Couleur du contour
            fillColor="rgba(0, 128, 255, 0.2)" // Couleur de remplissage
            strokeWidth={2} // Épaisseur du contour
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default PollutionMap;
