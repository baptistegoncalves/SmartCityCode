import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import MetroImage from '../assets/images_Popup/metroA.png';  
import ProtestImage from '../assets/images_Popup/regroupement.png'; 
import PollutionImage from '../assets/images_Popup/pollution.png';

const TrafficInfo: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Section Infos Traffic */}
      <Text style={styles.title}>Infos traffic</Text>

      {/* Section En cours */}
      <Text style={styles.subtitle}>⚠️ En cours :</Text>
      <View style={styles.infoBox}>
        <Image
          source={MetroImage}  // Utilisation de l'image locale
          style={styles.infoImage}
        />
        <Text style={styles.infoTitle}>!! Alerte métro A !!</Text>
        <Text style={styles.infoDescription}>Métro A hors service pendant 2 heures</Text>
      </View>

      {/* Section Programmé */}
      <Text style={styles.subtitle}>🕒 Programmé :</Text>
      <View style={styles.infoBox}>
        <Image
          source={ProtestImage}  // Utilisation de l'image locale
          style={styles.infoImage}
        />
        <Text style={styles.infoTitle}>Alerte regroupement</Text>
        <Text style={styles.infoDescription}>
          Regroupement prévu le 29 septembre place des Terreaux de 17h00 à 18h00
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Image
          source={PollutionImage}  // Utilisation de l'image locale
          style={styles.infoImage}
        />
        <Text style={styles.infoTitle}>Alerte pollution</Text>
        <Text style={styles.infoDescription}>
          Grosse masse de pollution prévue le 30 septembre sur Lyon toute la journée
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  infoImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoDescription: {
    fontSize: 14,
  },
});

export default TrafficInfo;
