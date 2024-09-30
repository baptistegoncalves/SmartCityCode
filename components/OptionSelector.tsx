import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const options = ["Chaud", "Sécurité", "Sain", "Calme"] as const;
type Option = (typeof options)[number];

interface OptionSelectorProps {
  selectedOptions: Option[];
  onSelectOption: (option: Option) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  selectedOptions,
  onSelectOption,
}) => {
  const getOptionStyle = (option: Option) => {
    switch (option) {
      case "Chaud":
        return styles.Chaud;
      case "Sécurité":
        return styles.sécurité;
      case "Sain":
        return styles.sain;
      case "Calme":
        return styles.calme;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selectedOptions.includes(option) && styles.selectedOption,
            selectedOptions.includes(option) && getOptionStyle(option),
          ]}
          onPress={() => onSelectOption(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 300, // Ajustez cette valeur selon vos besoins
    left: 20,
    right: 20,
    alignSelf: "center",
  },
  option: {
    padding: 10,
    borderRadius: 15,
  },
  selectedOption: {
    borderRadius: 15,
  },
  optionText: {
    color: "black",
  },
  Chaud: {
    backgroundColor: "#FFC085",
  },
  sécurité: {
    backgroundColor: "#858FFF",
  },
  sain: {
    backgroundColor: "#92EAA2",
  },
  calme: {
    backgroundColor: "#DF8FFF",
  },
});

export default OptionSelector;
