import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function IconsButton({ icon, color, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.button}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
    </Pressable>
  );
}

export default IconsButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    // backgroundColor: "#a4de6e",
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  flatText: {
    color: "#d98f4e",
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: "#3c6499",
    borderRadius: 4,
  },
});
