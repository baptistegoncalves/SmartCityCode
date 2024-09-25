import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BoulangerieIcon from "../assets/icons_Popup/boulangerie.svg";
import Croix from "../assets/icons_Popup/croix.svg";
import EcoleIcon from "../assets/icons_Popup/ecole.svg";
import MaisonIcon from "../assets/icons_Popup/maison.svg";
import Ping_orange from "../assets/icons_Popup/ping_orange.svg";
import Ping_vert from "../assets/icons_Popup/ping_vert.svg";

const truncate = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const ForYou: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.sectionTitle}>Enregistré</Text>
        <View style={styles.registeredContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
          >
            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <MaisonIcon width={24} height={24} />
              </View>
              <Text style={styles.itemText}>{truncate("Maison", 8)}</Text>
              <Text style={styles.distanceText}>3.9 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <EcoleIcon width={24} height={24} />
              </View>
              <Text style={styles.itemText}>{truncate("École", 8)}</Text>
              <Text style={styles.distanceText}>5.7 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <BoulangerieIcon width={24} height={24} />
              </View>
              <Text style={styles.itemText}>{truncate("Boulangerie", 6)}</Text>
              <Text style={styles.distanceText}>950 m</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <MaisonIcon width={24} height={24} />
              </View>
              <Text style={styles.itemText}>{truncate("Appartement", 6)}</Text>
              <Text style={styles.distanceText}>10 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <MaisonIcon width={24} height={24} />
              </View>
              <Text style={styles.itemText}>{truncate("Travail", 8)}</Text>
              <Text style={styles.distanceText}>9.3 km</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Récents</Text>
        <View style={styles.recentContainer}>
          <TouchableOpacity style={styles.recentItem}>
            <Ping_vert width={24} height={24} />
            <View>
              <Text style={styles.recentText}>Repère placé</Text>
              <Text style={styles.recentSubText}>
                Quai Pascal Paoli, La Marine, 20137 Porto-Vecchio
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <MaisonIcon width={24} height={24} />
            <View>
              <Text style={styles.recentText}>Maison</Text>
              <Text style={styles.recentSubText}>
                20 route de Cala Rossa, 20137 Trinité de Porto-Vecchio
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.recentItem, styles.noBorder]}>
            <Ping_orange width={24} height={24} />
            <View>
              <Text style={styles.recentText}>Repère placé</Text>
              <Text style={styles.recentSubText}>41°38'11.1"N 9°04'38.5"E</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  scrollView: {
    marginTop: 8,
  },
  registeredContainer: {
    backgroundColor: "#f9f9f9", // Fond gris clair
    borderRadius: 12,
    padding: 12,
  },
  item: {
    alignItems: "center",
    marginRight: 16, // Espace entre les items
  },
  iconCircle: {
    backgroundColor: "#858FFF",
    opacity: 0.2,
    width: 60,
    height: 60,
    borderRadius: 30, // Cercle
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    color: "#555",
  },
  distanceText: {
    fontSize: 12,
    color: "#808080",
    textAlign: "center",
  },
  recentContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  noBorder: {
    borderBottomWidth: 0, // Pas de bordure pour le dernier élément
  },
  recentText: {
    fontSize: 16,
    fontWeight: "400",
  },
  recentSubText: {
    fontSize: 12,
    color: "#808080",
  },
  icon: {
    marginRight: 12,
  },
});

export default ForYou;
