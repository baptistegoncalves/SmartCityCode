import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

type MapScreenProps = NativeStackScreenProps<RootStackParamList, 'Map'> & {
  benches: Array<any>;
  parks: Array<any>;
  noiseZones: Array<any>;
};

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function MapScreen({ benches, parks, noiseZones }: MapScreenProps) {
  const [region, setRegion] = React.useState({
    latitude: 48.8566, // Default to Paris coordinates
    longitude: 2.3522,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [location, setLocation] = React.useState<Location.LocationObject | null>(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {/* Render markers for benches */}
        {benches.map((bench, index) => {
          const lat = parseFloat(bench.lat);
          const lon = parseFloat(bench.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return (
              <Marker
                key={`bench-${index}`}
                coordinate={{ latitude: lat, longitude: lon }}
                title={`Bench ${bench.gid}`}
                pinColor="blue"
              />
            );
          } else {
            return null;
          }
        })}

        {/* Render markers for parks */}
        {parks.map((park, index) => {
          const lat = parseFloat(park.lat);
          const lon = parseFloat(park.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return (
              <Marker
                key={`park-${index}`}
                coordinate={{ latitude: lat, longitude: lon }}
                title={park.nom}
                pinColor="green"
              />
            );
          } else {
            return null;
          }
        })}

        {/* Render markers for noise zones */}
        {noiseZones.map((zone, index) => {
          const lat = parseFloat(zone.lat);
          const lon = parseFloat(zone.lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return (
              <Marker
                key={`zone-${index}`}
                coordinate={{ latitude: lat, longitude: lon }}
                title={`Noise Zone: ${zone.nom}`}
                pinColor="red"
              />
            );
          } else {
            return null;
          }
        })}
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
  },
  map: {
    width: width,
    height: height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
});

export default MapScreen;
