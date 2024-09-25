import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MainPopup from './components/MainPopup';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MainPopup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: 'white',
  },
});
