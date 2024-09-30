import BottomSheet from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createClient } from "@supabase/supabase-js"; // Importez createClient de Supabase
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import noiseData from "../assets/datasets/bruit.mesures_observatoire_acoustique.json"; // Importez votre fichier JSON
import Add_Pin_Button from "./Add_Pin_Button";
import AddPinPopup from "./AddPinPopup";
import MainPopup from "./MainPopup"; // Importez MainPopup
import OptionSelector from "./OptionSelector"; // Importez OptionSelector
import PinDetailsPopup from "./PinDetailsPopup";

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const options = ["Rapide", "Sécurité", "Sain", "Calme"] as const;
type Option = (typeof options)[number];

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  CameraMap: undefined;
};

type MapScreenProps = NativeStackScreenProps<RootStackParamList, "Map">;

interface Camera {
  nom: string;
  id: string;
  observation?: string;
  gid: string;
  lon: number;
  lat: number;
}

type Pin = {
  id: number | string;
  lat: number;
  lon: number;
  name: string;
  reason: string;
};

type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

const supabaseUrl = "https://tpzxhsjdxvqoroyflzpq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenhoc2pkeHZxb3JveWZsenBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNTY5MTksImV4cCI6MjA0MjkzMjkxOX0.SEq5hD2kohn-WxXE1VUXA6MKvnr9ev-9Sqz3M-2ciVQ"; // Remplacez par votre clé Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

function MapScreen({ navigation }: MapScreenProps) {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [cameraLocations, setCameraLocations] = useState<Camera[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [bottomSheetMode, setBottomSheetMode] = useState<
    "closed" | "pinDetails" | "addPin" | "success"
  >("closed");

  // Référence pour le Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  // Fonction pour récupérer les pins de Supabase
  const fetchPins = async () => {
    const { data, error } = await supabase.from("PinUser").select("*");
    if (error) {
      console.error("Erreur lors de la récupération des pins:", error.message);
    } else if (data) {
      setPins(data);
    }
  };

  useEffect(() => {
    // Récupérer la localisation de l'utilisateur
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission de localisation refusée");
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
      // Surveiller les changements de position
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
    // Charger les pins depuis Supabase
    fetchPins();
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

  // Fonction pour recentrer la carte sur la position actuelle
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

  // Fonction pour fermer le Bottom Sheet
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setBottomSheetMode("closed");
    setSelectedPin(null);
  };

  // Fonction pour ouvrir les détails du pin
  const openPinDetails = (pin: Pin) => {
    setSelectedPin(pin);
    setBottomSheetMode("pinDetails");
    bottomSheetRef.current?.snapToIndex(0);
  };

  // Fonction pour supprimer un pin
  const deletePin = async () => {
    if (selectedPin) {
      const { error } = await supabase
        .from("PinUser")
        .delete()
        .eq("id", selectedPin.id);
      if (error) {
        console.error("Erreur lors de la suppression du pin:", error.message);
        Alert.alert("Erreur", "Impossible de supprimer le pin.");
      } else {
        setPins((prevPins) =>
          prevPins.filter((pin) => pin.id !== selectedPin.id)
        );
        closeBottomSheet();
      }
    }
  };

  // Fonction pour gérer l'ajout d'un nouveau pin
  const handleAddPin = async (
    name: string,
    reason: string,
    location: Location.LocationObject
  ) => {
    const newPin = {
      name,
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      reason,
    };
    try {
      const { data, error } = await supabase
        .from("PinUser")
        .insert([
          {
            lat: newPin.lat,
            lon: newPin.lon,
            reason: newPin.reason,
            name: newPin.name,
          },
        ])
        .select();
      if (error) {
        throw new Error(
          "Erreur lors de l'ajout du pin dans la base de données"
        );
      }
      const [insertedPin] = data;
      setPins((prevPins) => [...prevPins, insertedPin]);
      setBottomSheetMode("success");
      setTimeout(() => {
        closeBottomSheet();
      }, 1500);
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Impossible d'ajouter le pin.");
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <MapView
        style={[styles.map, { zIndex: 0 }]}
        region={region || undefined}
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
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.lat,
              longitude: pin.lon,
            }}
            title={pin.name}
            description={pin.reason}
            onPress={() => openPinDetails(pin)}
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleOptions}>
        <FontAwesome name="bars" size={24} color="black" />
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <OptionSelector
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
          />
        </View>
      )}
      {!showOptions && <MainPopup togglePopup={togglePopup} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.recenterButton} onPress={centerMap}>
          <FontAwesome name="location-arrow" size={24} color="black" />
        </TouchableOpacity>
        <Add_Pin_Button
          onPress={() => {
            setBottomSheetMode("addPin");
            bottomSheetRef.current?.snapToIndex(0);
          }}
        />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        style={[styles.bottomSheet, { zIndex: 10, elevation: 10 }]}
        onClose={() => setBottomSheetMode("closed")}
      >
        {bottomSheetMode === "pinDetails" && selectedPin && (
          <PinDetailsPopup
            selectedPin={selectedPin}
            deletePin={deletePin}
            closeBottomSheet={closeBottomSheet}
          />
        )}
        {bottomSheetMode === "addPin" && (
          <AddPinPopup
            handleAddPin={handleAddPin}
            closeBottomSheet={closeBottomSheet}
          />
        )}
        {bottomSheetMode === "success" && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.chevronContainer}>
              <View style={styles.chevron} />
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher..."
                placeholderTextColor="#aaa"
              />
              <Image
                source={require("../assets/ImageBaptiste/LuffyAvatar.jpeg")}
                style={styles.avatar}
              />
            </View>
            <View style={styles.successMessageContainer}>
              <Text style={styles.successMessageText}>
                📍 Pin ajouté avec succès
              </Text>
            </View>
          </View>
        )}
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: width,
    height: height,
  },
  toggleButton: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    top: -392,
    left: 323,
  },
  toggleButtonText: {
    color: "black",
  },
  recenterButton: {
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    top: -250,
    left: 313,
  },
  optionsContainer: {
    position: "absolute",
    bottom: -200,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F9F9F9",
  },
  bottomSheet: {
    zIndex: 2,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chevronContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  chevron: {
    width: 40,
    height: 5,
    backgroundColor: "#000",
    borderRadius: 2.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: "100%",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  successMessageContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  successMessageText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MapScreen;
