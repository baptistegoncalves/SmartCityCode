import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TrafficInfo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Section Infos Traffic */}
      <Text style={styles.title}>Infos traffic</Text>

      {/* Section En cours */}
      <Text style={styles.subtitle}>⚠️ En cours :</Text>
      <View style={styles.infoBox}>
        <Image
          source={{ uri: 'https://example.com/metro-image.jpg' }} // Placeholder pour l'image du métro
          style={styles.infoImage}
        />
        <Text style={styles.infoTitle}>!! Alerte métro A !!</Text>
        <Text style={styles.infoDescription}>Métro A hors service pendant 2 heures</Text>
      </View>

      {/* Section Programmé */}
      <Text style={styles.subtitle}>🕒 Programmé :</Text>
      <View style={styles.infoBox}>
        <Image
          source={{ uri: 'https://example.com/protest-image.jpg' }} // Placeholder pour l'image de la manifestation
          style={styles.infoImage}
        />
        <Text style={styles.infoTitle}>Alerte regroupement</Text>
        <Text style={styles.infoDescription}>
          Regroupement prévu le 29 septembre place des Terreaux de 17h00 à 18h00
        </Text>
      </View>
    </View>
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
