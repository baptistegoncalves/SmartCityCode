import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainPopup from "./MainPopup"; // Importez MainPopup
import OptionSelector from "./OptionSelector"; // Importez OptionSelector

type RootStackParamList = { Home: undefined; Map: undefined };
type MapScreenProps = NativeStackScreenProps<RootStackParamList, "Map">;

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const options = ["Rapide", "Sécurité", "Sain", "Calme"] as const;
type Option = (typeof options)[number];

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((opt) => opt !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
    // Logique pour ajuster l'itinéraire en fonction des options sélectionnées
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    if (isPopupOpen) {
      setIsPopupOpen(false); // Fermer le pop-up si les options sont affichées
    }
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
      />
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
      </View>
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
  buttonContainer: {
    position: "absolute",
    bottom: 250,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
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
