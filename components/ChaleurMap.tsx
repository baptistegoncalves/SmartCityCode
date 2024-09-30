import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
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
  const [showHeatPoints, setShowHeatPoints] = useState(false);

  useEffect(() => {
    // Charger les données depuis le fichier JSON local
    setCapteurs(capteursData);
    console.log("Capteurs chargés :", capteursData); // Pour vérifier les données chargées
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 45.764043, // Coordonnées initiales de Lyon
          longitude: 4.835659,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {showHeatPoints &&
          capteurs.map((capteur, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: capteur.lat, longitude: capteur.lon }}
              title={capteur.nom}
            />
          ))}
      </MapView>
      <Button
        title="Afficher les points de chaleur"
        onPress={() => {
          setShowHeatPoints(!showHeatPoints);
          console.log(
            "Bouton pressé - Affichage des points de chaleur :",
            !showHeatPoints
          );
        }}
      />
    </View>
  );
};

export default ChaleurMap;
