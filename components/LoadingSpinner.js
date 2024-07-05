import { View, ActivityIndicator, StyleSheet } from "react-native";

function LoadinSpinner() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

export default LoadinSpinner;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
