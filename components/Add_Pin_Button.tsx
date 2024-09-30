import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AddPinButtonProps {
  onPress: () => void;
}

export default function Add_Pin_Button({ onPress }: AddPinButtonProps) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
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
    top: -180,
  },
  plusSign: {
    fontSize: 30,
    color: "black",
    top: -2,
  },
});
