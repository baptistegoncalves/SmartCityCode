import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';  // Importation de PagerView
import ForYou from './ForYou';
import TrafficInfo from './TrafficInfo';
import avatarImage from '../assets/images_Popup/doug.jpg';

interface MainPopupProps {
  isOpen: boolean;
  togglePopup: () => void;
}

const MainPopup: React.FC<MainPopupProps> = ({ isOpen, togglePopup }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<PagerView>(null); // Référence pour PagerView
  const [selectedTab, setSelectedTab] = React.useState(0); // Tab index

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [564, 0], // Ajustez selon la hauteur souhaitée du pop-up lorsqu'il est fermé
  });

  const handlePageChange = (index: number) => {
    setSelectedTab(index);
    pagerRef.current?.setPage(index); // Gérer le changement de page
  };

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

      {/* Sélecteur d'onglets */}
      <View style={styles.tabSwitcher}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handlePageChange(0)}
            style={[styles.tabButton, selectedTab === 0 && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
              Pour toi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePageChange(1)}
            style={[styles.tabButton, selectedTab === 1 && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>
              Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PagerView pour le swipe */}
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setSelectedTab(e.nativeEvent.position)}
        ref={pagerRef}
      >
        <View key="1">
          <ForYou />
        </View>
        <View key="2">
          <TrafficInfo />
        </View>
      </PagerView>
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
  pagerView: {
    flex: 1,
  },
});

export default MainPopup;
