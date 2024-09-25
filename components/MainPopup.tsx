import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importation de FontAwesome
import ForYou from './ForYou';
import TrafficInfo from './TrafficInfo';
import avatarImage from '../assets/images_Popup/doug.jpg';
import backgroundImage from '../assets/images_Popup/background.jpg'; // Assure-toi d'importer ton image de fond

const MainPopup: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'ForYou' | 'Info'>('ForYou');
  const [modalVisible, setModalVisible] = useState(true); // État pour afficher le modal

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)} // Fermer le modal
    >
      <View style={styles.overlay}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
        <View style={styles.container}>

          {/* Flèche de retour (Chevron Down) */}
          <TouchableOpacity style={styles.arrowButton} onPress={() => setModalVisible(false)}>
            <FontAwesome name="chevron-down" size={24} color="black" />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Maison"
              style={styles.searchInput}
            />
            <Image
              source={avatarImage}
              style={styles.avatar}
            />
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setSelectedTab('ForYou')}
                style={[styles.tabButton, selectedTab === 'ForYou' && styles.activeTab]}
              >
                <Text style={[styles.tabText, selectedTab === 'ForYou' && styles.activeTabText]}>
                  Pour toi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTab('Info')}
                style={[styles.tabButton, selectedTab === 'Info' && styles.activeTab]}
              >
                <Text style={[styles.tabText, selectedTab === 'Info' && styles.activeTabText]}>
                  Info
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView>
            {selectedTab === 'ForYou' ? <ForYou /> : <TrafficInfo />}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Positionner le contenu en bas
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover', // Pour couvrir tout l'écran
  },
  container: {
    width: '100%', // Prendre toute la largeur de l'écran
    height: '84%', // Ajuster la hauteur du pop-up
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Couleur de fond avec un peu de transparence
    borderTopLeftRadius: 16, // Coins arrondis en haut à gauche
    borderTopRightRadius: 16, // Coins arrondis en haut à droite
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // Légèrement au-dessus de l'écran
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative', // Nécessaire pour que la flèche soit positionnée par rapport à ce conteneur
  },
  arrowButton: {
    position: 'absolute',
    top: -10, // Ajuste cette valeur pour placer la flèche à l'intérieur du pop-up, proche du bord supérieur
    alignSelf: 'center', // Centrer horizontalement la flèche
    zIndex: 10, // S'assurer que la flèche est au-dessus de tout autre élément
    backgroundColor: 'white',
    borderRadius: 50, // Pour arrondir le fond de la flèche
    padding: 5, // Ajuste l'espacement autour de la flèche pour qu'elle soit plus visible
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: '#4A4A4A',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center', // Centrer les onglets horizontalement
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centrer les boutons dans leur conteneur
    alignItems: 'center',
    width: '80%', // Largeur des onglets limitée pour plus d'espacement
  },
  tabButton: {
    paddingBottom: 10,
    marginHorizontal: 16, // Espace entre les boutons
  },
  activeTab: {
    borderBottomWidth: 3, // Bordure plus épaisse pour l'onglet actif
    borderBottomColor: '#858FFF', // Couleur noire pour l'onglet actif
  },
  tabText: {
    fontSize: 18,
    color: '#808080', // Texte grisé par défaut pour les onglets inactifs
  },
  activeTabText: {
    fontSize: 18,
    fontWeight: 'bold', // Texte plus gras pour l'onglet actif
    color: '#000', // Couleur noire pour l'onglet actif
  },
});

export default MainPopup;
