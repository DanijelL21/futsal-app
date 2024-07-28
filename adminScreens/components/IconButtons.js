// External Libraries
import { StyleSheet, View, Text } from "react-native";

// Internal Modules
import IoniconsButton from "../../components/buttons/IoniconsButton";
import dimensions from "../../constants/dimensions";

// Default no-op function
const noop = () => {};
const ICON_SIZE = dimensions.screenWidth * 0.05;

export const GoalButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <IoniconsButton
    icon="football"
    color="white"
    size={size}
    onPress={onPress}
    buttonStyle={styles.button}
  />
);

export const YellowCardButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <IoniconsButton
    icon="square"
    color="yellow"
    size={size}
    onPress={onPress}
    buttonStyle={styles.button}
  />
);

export const RedCardButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <IoniconsButton
    icon="square"
    color="red"
    size={size}
    onPress={onPress}
    buttonStyle={styles.button}
  />
);

export const OwnGoalButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <IoniconsButton
    icon="football"
    color="red"
    size={size}
    onPress={onPress}
    buttonStyle={styles.button}
  />
);

export const PenaltyButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <View style={styles.penaltyContainer}>
    <IoniconsButton
      icon="football"
      size={size}
      color="white"
      onPress={onPress}
      buttonStyle={styles.button}
    />
    <Text
      style={[
        styles.overlayText,
        { fontSize: size * 0.6, bottom: size * -0.6, right: size * 0.6 },
      ]}
    >
      P
    </Text>
  </View>
);

export const PenaltyMissedButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <View style={styles.penaltyContainer}>
    <IoniconsButton
      icon="football"
      size={size}
      color="white"
      onPress={onPress} // No-op for this button
      buttonStyle={styles.button}
    />
    <Text
      style={[
        styles.overlayText,
        { fontSize: size * 0.6, bottom: size * -0.6, right: size * 0.6 },
      ]}
    >
      P
    </Text>
    <IoniconsButton
      icon="close"
      size={size}
      color="red"
      onPress={onPress}
      buttonStyle={[styles.button, styles.overlayIcon]}
    />
  </View>
);

export const AssistButton = ({ onPress = noop, size = ICON_SIZE }) => (
  <View style={styles.penaltyContainer}>
    <IoniconsButton
      icon="football"
      size={size}
      color="white"
      onPress={onPress}
      buttonStyle={styles.button}
    />
    <Text
      style={[
        styles.overlayText,
        { fontSize: size * 0.6, bottom: size * -0.6, right: size * 0.6 },
      ]}
    >
      A
    </Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  button: {
    padding: dimensions.screenWidth * 0.02,
  },
  penaltyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  overlayText: {
    color: "red",
    fontWeight: "bold",
  },
  overlayIcon: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
