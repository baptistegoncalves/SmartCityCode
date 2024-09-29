import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";

// Importation du fichier JSON local
import capteursData from "../capteurs_data.json"; // Assurez-vous que le chemin est correct

// Type pour un capteur
interface Capteur {
  lat: number;
  lon: number;
  nom: string;
}

const ChaleurMap = () => {
  const [capteurs, setCapteurs] = useState<Capteur[]>([]);

  useEffect(() => {
    // Charger les données depuis le fichier JSON local
    setCapteurs(capteursData);
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 45.764043, // Coordonnées initiales de Lyon
        longitude: 4.835659,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
    >
      {capteurs.map((capteur, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: capteur.lat, longitude: capteur.lon }}
          title={capteur.nom}
        />
      ))}
    </MapView>
  );
};

export default ChaleurMap;
