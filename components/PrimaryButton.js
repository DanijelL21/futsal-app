import { Pressable, Text, StyleSheet, Platform } from "react-native";

function PrimaryButton({ onPress, buttonText, buttonStyle, buttonTextStyle }) {
  const combinedButtonStyle = [styles.buttonStyle, buttonStyle];

  return (
    <Pressable
      style={({ pressed }) =>
        pressed ? [combinedButtonStyle, styles.pressed] : combinedButtonStyle
      }
      onPress={onPress}
    >
      <Text style={buttonTextStyle}>{buttonText}</Text>
    </Pressable>
  );
}

export default PrimaryButton;

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
