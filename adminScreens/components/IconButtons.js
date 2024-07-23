import { StyleSheet, View, Text } from "react-native";
import IoniconsButton from "../../components/buttons/IoniconsButton";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";
const ICON_SIZE = dimensions.screenWidth * 0.05;

export const GoalButton = ({ team, seconds, handleIconPress }) => (
  <IoniconsButton
    icon="football"
    color="white"
    size={ICON_SIZE}
    onPress={
      handleIconPress
        ? () =>
            handleIconPress({
              event: "goal",
              team,
              time: Math.floor(seconds / 60) + 1,
            })
        : undefined
    }
    buttonStyle={styles.button}
  />
);

export const YellowCardButton = ({ team, seconds, handleIconPress }) => (
  <IoniconsButton
    icon="square"
    color="yellow"
    size={ICON_SIZE}
    onPress={
      handleIconPress
        ? () =>
            handleIconPress({
              event: "yellow card",
              team,
              time: Math.floor(seconds / 60) + 1,
            })
        : undefined
    }
    buttonStyle={styles.button}
  />
);

export const RedCardButton = ({ team, seconds, handleIconPress }) => (
  <IoniconsButton
    icon="square"
    color="red"
    size={ICON_SIZE}
    onPress={
      handleIconPress
        ? () =>
            handleIconPress({
              event: "red card",
              team,
              time: Math.floor(seconds / 60) + 1,
            })
        : undefined
    }
    buttonStyle={styles.button}
  />
);

export const OwnGoalButton = ({ team, seconds, handleIconPress }) => (
  <IoniconsButton
    icon="football"
    color="red"
    size={ICON_SIZE}
    onPress={
      handleIconPress
        ? () =>
            handleIconPress({
              event: "own goal",
              team,
              time: Math.floor(seconds / 60) + 1,
            })
        : undefined
    }
    buttonStyle={styles.button}
  />
);

export const PenaltyButton = ({ team, seconds, handleIconPress }) => {
  return (
    <View style={styles.penaltyContainer}>
      <IoniconsButton
        icon="football"
        size={ICON_SIZE}
        color="white"
        onPress={
          handleIconPress
            ? () =>
                handleIconPress({
                  event: "penalty scored",
                  team,
                  time: Math.floor(seconds / 60) + 1,
                })
            : undefined
        }
        buttonStyle={styles.button}
      />
      <Text style={styles.overlayText}>P</Text>
    </View>
  );
};

export const PenaltyMissedButton = ({ team, seconds, handleIconPress }) => {
  return (
    <View style={styles.penaltyContainer}>
      <IoniconsButton
        icon="football"
        size={ICON_SIZE}
        color="white"
        onPress={() => {}}
        buttonStyle={styles.button}
      />
      <Text style={styles.overlayText}>P</Text>
      <IoniconsButton
        icon="close"
        size={ICON_SIZE}
        color="red"
        onPress={
          handleIconPress
            ? () =>
                handleIconPress({
                  event: "penalty missed",
                  team,
                  time: Math.floor(seconds / 60) + 1,
                })
            : undefined
        }
        buttonStyle={[styles.button, styles.overlayIcon]}
      />
    </View>
  );
};

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
    color: "red", // Strong red color
    fontWeight: "bold",
    fontSize: ICON_SIZE * 0.6, // Adjust font size as needed
    bottom: ICON_SIZE * -0.6,
    right: ICON_SIZE * 0.6, // Adjust this multiplier to position the text near the ball
  },
  overlayIcon: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
