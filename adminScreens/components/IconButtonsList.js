// External Libraries
import React from "react";
import { StyleSheet, View } from "react-native";

// Internal Modules
import {
  GoalButton,
  OwnGoalButton,
  RedCardButton,
  YellowCardButton,
  PenaltyButton,
  PenaltyMissedButton,
} from "./IconButtons";
import dimensions from "../../constants/dimensions";

// Common icon size
const ICON_SIZE = dimensions.screenWidth * 0.05;

const IconButtonsList = ({ team, mode, seconds, handleIconPress }) => {
  const createOnPressHandler = (eventType) => () => {
    handleIconPress({
      event: eventType,
      team,
      time: Math.floor(seconds / 60) + 1,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {mode === "Regular game" ? (
          <>
            <View style={styles.columnContainer}>
              <GoalButton
                onPress={createOnPressHandler("goal")}
                size={ICON_SIZE}
              />
              <OwnGoalButton
                onPress={createOnPressHandler("ownGoal")}
                size={ICON_SIZE}
              />
            </View>
            <View style={styles.columnContainer}>
              <YellowCardButton
                onPress={createOnPressHandler("yellowCard")}
                size={ICON_SIZE}
              />
              <RedCardButton
                onPress={createOnPressHandler("redCard")}
                size={ICON_SIZE}
              />
            </View>
            <View style={styles.columnContainer}>
              <PenaltyButton
                onPress={createOnPressHandler("penaltyScored")}
                size={ICON_SIZE}
              />
              <PenaltyMissedButton
                onPress={createOnPressHandler("penaltyMissed")}
                size={ICON_SIZE}
              />
            </View>
          </>
        ) : (
          <View style={styles.rowContainer}>
            <PenaltyButton
              onPress={createOnPressHandler("penalty")}
              size={ICON_SIZE}
            />
            <PenaltyMissedButton
              onPress={createOnPressHandler("penaltyMissed")}
              size={ICON_SIZE}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: dimensions.screenWidth * 0.02,
  },
  columnContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default IconButtonsList;
