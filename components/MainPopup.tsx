import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import PagerView from "react-native-pager-view"; // Importation de PagerView
import ForYou from "./ForYou";
import TrafficInfo from "./TrafficInfo";

interface MainPopupProps {
  togglePopup: () => void;
}

const MainPopup: React.FC<MainPopupProps> = ({ togglePopup }) => {
  const screenHeight = Dimensions.get("window").height;
  const maxPopupHeight = screenHeight * 0.85; // 85% de la hauteur de l'écran
  const minPopupHeight = 160; // Hauteur minimale du pop-up

  const animation = useRef(new Animated.Value(minPopupHeight)).current;
  const pagerRef = useRef<PagerView>(null); // Référence pour PagerView
  const [selectedTab, setSelectedTab] = useState(0); // Tab index
  const [isExpanded, setIsExpanded] = useState(false); // État pour suivre si le pop-up est étendu ou non

  const handlePageChange = (index: number) => {
    setSelectedTab(index);
    pagerRef.current?.setPage(index); // Gérer le changement de page
  };

  const toggleHeight = () => {
    const toValue = isExpanded ? minPopupHeight : maxPopupHeight;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View style={[styles.container, { height: animation }]}>
      {/* Barre pour ouvrir/fermer le pop-up */}
      <TouchableOpacity style={styles.handleBar} onPress={toggleHeight} />

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <TextInput placeholder="Maison" style={styles.searchInput} />
      </View>

      {/* Sélecteur d'onglets */}
      <View style={styles.tabSwitcher}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handlePageChange(0)}
            style={[styles.tabButton, selectedTab === 0 && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 0 && styles.activeTabText,
              ]}
            >
              Pour toi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePageChange(1)}
            style={[styles.tabButton, selectedTab === 1 && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 1 && styles.activeTabText,
              ]}
            >
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 34, // Ajout de padding en bas pour éviter le masquage
  },
  handleBar: {
    alignSelf: "center",
    width: 40,
    height: 7,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 50,
    padding: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: "#4A4A4A",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  tabSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  tabButton: {
    paddingBottom: 10,
    marginHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#858FFF",
  },
  tabText: {
    fontSize: 18,
    color: "#808080",
  },
  activeTabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  pagerView: {
    flex: 1,
  },
});

export default MainPopup;
