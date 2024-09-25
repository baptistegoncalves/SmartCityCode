import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet } from 'react-native';
import ForYou from './ForYou';
import TrafficInfo from './TrafficInfo';
import avatarImage from '../assets/Image_Popup/doug.jpg';

const MainPopup: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'ForYou' | 'Info'>('ForYou');

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
