import { Pressable, StyleSheet, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IoniconsButton({ icon, color, size, onPress, buttonStyle }) {
  const combinedButtonStyle = [styles.buttonStyle, buttonStyle];

  return (
    <Pressable
      style={({ pressed }) =>
        pressed ? [combinedButtonStyle, styles.pressed] : combinedButtonStyle
      }
      onPress={onPress}
    >
      <View style={styles.button}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

export default IoniconsButton;

const styles = StyleSheet.create({
  buttonStyle: {
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  pressed: {
    opacity: 0.75,
  },
});
