// External Libraries
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Internal Modules
import colors from "../constants/colors.js";

function Background({ children, style = null }) {
  return (
    <LinearGradient
      colors={[colors.backgroundUpperColor, colors.backgroundLowerColor]}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Background;
