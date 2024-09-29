// PinDetailsPopup.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type Pin = {
  id: number | string;
  lat: number;
  lon: number;
  name: string;
  reason: string;
};

type PinDetailsPopupProps = {
  selectedPin: Pin;
  deletePin: () => void;
  closeBottomSheet: () => void;
};

const PinDetailsPopup: React.FC<PinDetailsPopupProps> = ({
  selectedPin,
  deletePin,
  closeBottomSheet,
}) => {
  return (
    <View style={styles.bottomSheetContent}>
      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <View style={styles.chevron} />
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#aaa"
        />
        <Image
          source={require('../assets/ImageBaptiste/LuffyAvatar.jpeg')} // Remplacez par le chemin de votre image
          style={styles.avatar}
        />
      </View>

      {/* Détails du pin */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <FontAwesome name="home" size={24} color="blue" />
            </View>
          </View>
          <Text style={styles.cardTitle}>{selectedPin.name}</Text>
          <Text style={styles.pinTitle}>📍</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Nom :</Text>
            <Text style={styles.cardValue}>{selectedPin.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Longitude :</Text>
            <Text style={styles.cardValue}>{selectedPin.lon}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Latitude :</Text>
            <Text style={styles.cardValue}>{selectedPin.lat}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Raison :</Text>
            <TouchableOpacity>
              <Text style={styles.cardLink}>{selectedPin.reason}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bouton Supprimer */}
      <TouchableOpacity style={styles.deleteButton} onPress={deletePin}>
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chevronContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  chevron: {
    width: 40,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  iconBackground: {
    backgroundColor: '#D1C4E9',
    padding: 10,
    borderRadius: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  pinTitle: {
    fontSize: 25,
  },
  cardContent: {
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontWeight: 'bold',
    flex: 1,
  },
  cardValue: {
    color: '#777',
    flex: 2,
    textAlign: 'right',
  },
  cardLink: {
    color: 'blue',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PinDetailsPopup;
