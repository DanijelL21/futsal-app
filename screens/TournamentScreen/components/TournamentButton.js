import { Pressable, View, Text, StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";

function TournamentButton({ onPress, buttonText, buttonColor }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <View style={[styles.innerContainer, { backgroundColor: buttonColor }]}>
          <Text style={styles.title}>{buttonText}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default TournamentButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    height: 100,
    borderRadius: 150,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: "hidden",
    margin: 36,
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
