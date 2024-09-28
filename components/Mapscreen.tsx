import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Circle } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

type MapScreenProps = NativeStackScreenProps<RootStackParamList, "Map">;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface PollutionData {
  gid: number;
  identifiant: number;
  nom: string;
  lat: number;
  lon: number;
  observation: string;
  libellelong: string;
}

function MapScreen({ navigation }: MapScreenProps) {
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);
  const [pollutionZones, setPollutionZones] = React.useState<PollutionData[]>([]);
  const [showPollutionZones, setShowPollutionZones] = React.useState(false); // État pour contrôler l'affichage des zones

  React.useEffect(() => {
    // Récupération de la localisation de l'utilisateur
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    })();

    // Récupération des zones de pollution depuis l'API
    const fetchPollutionData = async () => {
      try {
        const response = await fetch(
          'https://data.grandlyon.com/fr/datapusher/ws/rdata/pvo_patrimoine_voirie.pvocameracriter/all.json?maxfeatures=-1&start=1'
        );
        const data = await response.json();
        setPollutionZones(data.values); // Récupération des zones de pollution
      } catch (error) {
        console.error('Error fetching pollution data:', error);
      }
    };

    fetchPollutionData(); // Charger les zones de pollution
  }, []);

  // Fonction pour recentrer la carte sur la position de l'utilisateur
  const centerMap = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  // Fonction pour basculer l'affichage des zones de pollution
  const togglePollutionZones = () => {
    setShowPollutionZones((prevState) => !prevState);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {/* Afficher les zones de pollution uniquement si showPollutionZones est vrai */}
        {showPollutionZones &&
          pollutionZones.map((zone) => (
            <Circle
              key={zone.gid}
              center={{
                latitude: zone.lat,
                longitude: zone.lon,
              }}
              radius={1000} // Rayon en mètres, ajustez selon vos besoins
              strokeColor="rgba(0, 128, 255, 0.8)" // Couleur du contour
              fillColor="rgba(0, 128, 255, 0.2)" // Couleur de remplissage
              strokeWidth={2} // Épaisseur du contour
            />
          ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
        <Button
          title={showPollutionZones ? "Hide Pollution Zones" : "Show Pollution Zones"}
          onPress={togglePollutionZones} // Bascule l'affichage des zones
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: width,
    height: height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60, // Ajustez cette valeur pour positionner les boutons pas trop en bas
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1, // Assurez-vous que les boutons sont au-dessus de la carte
  },
});

export default MapScreen;
