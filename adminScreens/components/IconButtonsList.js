import React from "react";
import { StyleSheet, View } from "react-native";
import {
  GoalButton,
  OwnGoalButton,
  RedCardButton,
  YellowCardButton,
  PenaltyButton,
  PenaltyMissedButton,
} from "./IconButtons";
import dimensions from "../../constants/dimensions";

const IconButtonsList = ({ team, mode, seconds, handleIconPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        {mode === "Regular game" ? (
          <>
            <View style={styles.columnContainer}>
              <GoalButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
              <OwnGoalButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
            </View>
            <View style={styles.columnContainer}>
              <YellowCardButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
              <RedCardButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
            </View>
            <View style={styles.columnContainer}>
              <PenaltyButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
              <PenaltyMissedButton
                team={team}
                seconds={seconds}
                handleIconPress={handleIconPress}
              />
            </View>
          </>
        ) : (
          <View style={styles.rowContainer}>
            <PenaltyButton
              team={team}
              seconds={seconds}
              handleIconPress={handleIconPress}
            />
            <PenaltyMissedButton
              team={team}
              seconds={seconds}
              handleIconPress={handleIconPress}
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
    alignItems: "center", // Align items in the center horizontally
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Center items horizontally with space around each column
    marginBottom: dimensions.screenWidth * 0.02, // Add some margin between rows
  },
  columnContainer: {
    flexDirection: "column",
    alignItems: "center", // Align items in the center horizontally within each column
  },
});

export default IconButtonsList;
