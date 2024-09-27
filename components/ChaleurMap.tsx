import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Type pour un capteur
interface Capteur {
  deveui: string;
  nom: string;
  lat: number;
  lon: number;
  status: string;
  temperature: number | null;
  datemaj: string;
}

const apiUrl = "http://127.0.0.1:5000/api/capteurs";

const ChaleurMap = () => {
  const [capteurs, setCapteurs] = useState<Capteur[]>([]); // Utilisation du type Capteur

  const fetchCapteurs = async () => {
    try {
      const response = await fetch(apiUrl);
      const data: Capteur[] = await response.json(); // Typage explicite ici
      setCapteurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des capteurs:", error);
    }
  };

  useEffect(() => {
    fetchCapteurs();
  }, []);

  return (
    <MapView style={{ flex: 1 }}>
      {capteurs.map((capteur, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: capteur.lat, longitude: capteur.lon }}
          title={`Température: ${
            capteur.temperature !== null
              ? `${capteur.temperature}°C`
              : "Non disponible"
          }`}
          description={`Capteur: ${capteur.nom}, Statut: ${capteur.status}, Dernière mise à jour: ${capteur.datemaj}`}
        />
      ))}
    </MapView>
  );
};

export default ChaleurMap;
