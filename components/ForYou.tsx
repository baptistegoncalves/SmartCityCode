import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Fonction pour tronquer un texte
const truncate = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const ForYou: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Section Enregistré */}
      <View>
        <Text style={styles.sectionTitle}>Enregistré</Text>
        <View style={styles.registeredContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <FontAwesome name="home" size={24} color="blue" />
              </View>
              <Text style={styles.itemText}>{truncate('Maison', 8)}</Text>
              <Text style={styles.distanceText}>3.9 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <FontAwesome name="graduation-cap" size={24} color="blue" />
              </View>
              <Text style={styles.itemText}>{truncate('École', 8)}</Text>
              <Text style={styles.distanceText}>5.7 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <FontAwesome name="shopping-bag" size={24} color="blue" />
              </View>
              <Text style={styles.itemText}>{truncate('Boulangerie', 6)}</Text>
              <Text style={styles.distanceText}>950 m</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <FontAwesome name="building" size={24} color="blue" />
              </View>
              <Text style={styles.itemText}>{truncate('Appartement', 6)}</Text>
              <Text style={styles.distanceText}>10 km</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <View style={styles.iconCircle}>
                <FontAwesome name="briefcase" size={24} color="blue" />
              </View>
              <Text style={styles.itemText}>{truncate('Travail', 8)}</Text>
              <Text style={styles.distanceText}>9.3 km</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Section Récents */}
      <View>
        <Text style={styles.sectionTitle}>Récents</Text>
        <View style={styles.recentContainer}>
          <TouchableOpacity style={styles.recentItem}>
            <FontAwesome name="map-marker" size={24} color="green" style={styles.icon} />
            <View>
              <Text style={styles.recentText}>Repère placé</Text>
              <Text style={styles.recentSubText}>Quai Pascal Paoli, La Marine, 20137 Porto-Vecchio</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <FontAwesome name="home" size={24} color="blue" style={styles.icon} />
            <View>
              <Text style={styles.recentText}>Maison</Text>
              <Text style={styles.recentSubText}>20 route de Cala Rossa, 20137 Trinité de Porto-Vecchio</Text>
            </View>
          </TouchableOpacity>
          {/* Dernier élément sans bordure inférieure */}
          <TouchableOpacity style={[styles.recentItem, styles.noBorder]}>
            <FontAwesome name="map-marker" size={24} color="orange" style={styles.icon} />
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
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollView: {
    marginTop: 8,
  },
  registeredContainer: {
    backgroundColor: '#f9f9f9', // Fond gris clair
    borderRadius: 12,
    padding: 12,
  },
  item: {
    alignItems: 'center',
    marginRight: 16, // Espace entre les items
  },
  iconCircle: {
    backgroundColor: '#858FFF', opacity: 0.2,
    width: 60,
    height: 60,
    borderRadius: 30, // Cercle
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    color: '#555',
  },
  distanceText: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'center',
  },
  recentContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  noBorder: {
    borderBottomWidth: 0, // Pas de bordure pour le dernier élément
  },
  recentText: {
    fontSize: 16,
    fontWeight: '400',
  },
  recentSubText: {
    fontSize: 12,
    color: '#808080',
  },
  icon: {
    marginRight: 12,
  },
});

export default ForYou;