import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <Button
        title="Connecter"
        onPress={() => navigation.navigate("Map")}
        color="#1E90FF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
