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
import capteursData from "../capteurs_data.json"; // Assurez-vous que le chemin est correct

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function Mapscreen() {
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [location, setLocation] = React.useState<Location.LocationObject | null>(null);

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
        {capteursData.map((capteur, index) => (
          <Circle
            key={index}
            center={{ latitude: capteur.lat, longitude: capteur.lon }}
            radius={2600} // Taille du cercle en mètres (ajustez cette valeur pour changer la taille)
            strokeColor="rgba(0, 150, 255, 0.5)" // Couleur du contour du cercle
            fillColor={
              capteur.temperature !== null
                ? `rgba(255, ${Math.max(0, 255 - capteur.temperature * 5)}, 0, 0.3)`
                : "rgba(100, 100, 100, 0.3)"
            } // Couleur du remplissage change en fonction de la température
            zIndex={1}
            onPress={() => Alert.alert("Température", `Température : ${capteur.temperature}°C`)}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={centerMap} />
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
    bottom: 60,
    left: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 1,
  },
});

export default Mapscreen;
