import { View, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../constants/colors";
function LoadinSpinner() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.headerTextColor} />
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
