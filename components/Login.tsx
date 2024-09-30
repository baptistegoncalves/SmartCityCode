import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Map: undefined;
};

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const Login = ({ navigation }: LoginProps) => {
  return (
    <View style={styles.container}>
      {/* Fond de la carte */}
      <Image
        source={require("../assets/imageAriane/loginfond.jpg")}
        style={styles.mapImage}
      />
      {/* Rectangle blanc centré */}
      <View style={styles.whiteBox}>
        {/* Ligne contenant le titre et le logo à droite */}
        <View style={styles.logoTitleContainer}>
          <Text style={styles.title}>Your way</Text>
          <Image
            source={require("../assets/imageAriane/logoyourway.png")}
            style={styles.logo}
          />
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.loginText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Text style={styles.signUpText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "relative",
  },
  logoTitleContainer: {
    flexDirection: "row", // Aligner le titre et le logo sur la même ligne
    alignItems: "center", // Aligner verticalement au centre
    marginBottom: 30,
  },
  logo: {
    width: 40, // Taille réduite pour s'aligner avec le texte
    height: 40,
    marginLeft: 10, // Espacement entre le texte et le logo
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginText: {
    color: "white",
    fontSize: 16,
  },
  signUpText: {
    color: "#007AFF",
    fontSize: 16,
    marginTop: 10,
  },
  mapImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    width: "100%",
    height: "100%",
  },
  whiteBox: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Pour ajouter des ombres sur Android
  },
});

export default Login;
