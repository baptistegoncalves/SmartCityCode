import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainPopup from "./MainPopup"; // Importez MainPopup
import OptionSelector from "./OptionSelector"; // Importez OptionSelector
import noiseData from "../assets/datasets/bruit.mesures_observatoire_acoustique.json"; // Importez votre fichier JSON

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  CameraMap: undefined;
};

type MapScreenProps = NativeStackScreenProps<RootStackParamList, "Map">;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const options = ["Rapide", "Sécurité", "Sain", "Calme"] as const;
type Option = (typeof options)[number];

interface Camera {
  nom: string;
  id: string;
  observation?: string;
  gid: string;
  lon: number;
  lat: number;
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
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
  const [showOptions, setShowOptions] = React.useState(false);
  const [cameraLocations, setCameraLocations] = React.useState<Camera[]>([]);

  React.useEffect(() => {
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
  }, []);

  const loadCamerasFromAPI = async () => {
    try {
      const response = await fetch(
        "https://data.grandlyon.com/fr/datapusher/ws/rdata/pvo_patrimoine_voirie.pvocameracriter/all.json?maxfeatures=-1&start=1"
      );
      const data = await response.json();
      // Récupérer les données pertinentes et les stocker dans le state
      const cameras = data.values.map((camera: any) => ({
        nom: camera.nom,
        id: camera.identifiant, // Assure que cela correspond au champ de l'API
        observation: camera.observation,
        gid: camera.gid,
        lon: parseFloat(camera.lon),
        lat: parseFloat(camera.lat),
      }));
      setCameraLocations(cameras);
      console.log(cameras); // Vérifier les données chargées
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        // Si l'option "Sécurité" est désélectionnée, vider les caméras
        if (option === "Sécurité") {
          setCameraLocations([]);
        }
        return prevSelectedOptions.filter((opt) => opt !== option);
      } else {
        // Si l'option "Sécurité" est sélectionnée, charger les caméras
        if (option === "Sécurité") {
          loadCamerasFromAPI();
        }
        return [...prevSelectedOptions, option];
      }
    });
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    if (isPopupOpen) {
      setIsPopupOpen(false); // Fermer le pop-up si les options sont affichées
    }
  };

  // Fonction pour obtenir la couleur en fonction du niveau de bruit
  const getColorFromNoiseLevel = (noiseLevel: number) => {
    const intensity = Math.min(
      255,
      Math.max(0, Math.floor((noiseLevel / 130) * 255))
    );
    const red = 255;
    const green = 255 - intensity;
    const blue = 255 - intensity;
    return `rgba(${red}, ${green}, ${blue}, 0.3)`; // Ajustez l'opacité ici (0.3 pour une opacité plus faible)
  };

  // Fonction pour obtenir le rayon en fonction du niveau de bruit
  const getRadiusFromNoiseLevel = (noiseLevel: number) => {
    return Math.min(500, Math.max(50, (noiseLevel * 10) / 2)); // Diviser le rayon par 2
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
        {/* Affichage des marqueurs de caméras */}
        {cameraLocations.map((camera) => (
          <Marker
            key={camera.id}
            coordinate={{
              latitude: camera.lat,
              longitude: camera.lon,
            }}
            title={`Caméra ${camera.nom}`}
            description={camera.observation || "Aucune description"}
          />
        ))}

        {/* Affichage des cercles de bruit uniquement si l'option "Calme" est sélectionnée */}
        {selectedOptions.includes("Calme") &&
          noiseData.values
            .filter((noisePoint: any) => noisePoint.lden > 65) // Filtrer les points de bruit > 65 dB
            .map((noisePoint: any, index: number) => (
              <Circle
                key={index}
                center={{
                  latitude: noisePoint.latitude,
                  longitude: noisePoint.longitude,
                }}
                radius={getRadiusFromNoiseLevel(noisePoint.lden)}
                fillColor={getColorFromNoiseLevel(noisePoint.lden)}
                strokeColor="rgba(0,0,0,0.2)"
              />
            ))}
      </MapView>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleOptions}>
        <Text style={styles.toggleButtonText}>
          {showOptions ? "Hide Options" : "Show Options"}
        </Text>
      </TouchableOpacity>
      {showOptions && (
        <OptionSelector
          selectedOptions={selectedOptions}
          onSelectOption={handleSelectOption}
        />
      )}
      {!showOptions && <MainPopup togglePopup={togglePopup} />}
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
  toggleButton: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  toggleButtonText: {
    color: "black",
  },
});

export default MapScreen;
