import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ForYou from './ForYou';
import TrafficInfo from './TrafficInfo';
import avatarImage from '../assets/images_Popup/doug.jpg';

interface MainPopupProps {
  isOpen: boolean;
  togglePopup: () => void;
}

const MainPopup: React.FC<MainPopupProps> = ({ isOpen, togglePopup }) => {
  const [selectedTab, setSelectedTab] = React.useState<'ForYou' | 'Info'>('ForYou');
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [564, 0], // Ajustez "250" selon la hauteur souhaitée du pop-up lorsqu'il est fermé
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* Flèche pour ouvrir/fermer le pop-up */}
      <TouchableOpacity style={styles.arrowButton} onPress={togglePopup}>
        <FontAwesome name={isOpen ? 'chevron-down' : 'chevron-up'} size={24} color="black" />
      </TouchableOpacity>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <TextInput placeholder="Maison" style={styles.searchInput} />
        <Image source={avatarImage} style={styles.avatar} />
      </View>

      {/* Afficher le reste du contenu */}
      <View style={styles.contentContainer}>
        {/* Sélecteur d'onglets */}
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

        {/* Contenu */}
        <ScrollView>
          {selectedTab === 'ForYou' ? <ForYou /> : <TrafficInfo />}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    height: 700, // Hauteur fixe du pop-up
  },
  arrowButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    marginBottom: 10,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    padding: 8,
    marginBottom: 16,
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
  contentContainer: {
    flex: 1,
  },
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  tabButton: {
    paddingBottom: 10,
    marginHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#858FFF',
  },
  tabText: {
    fontSize: 18,
    color: '#808080',
  },
  activeTabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default MainPopup;
