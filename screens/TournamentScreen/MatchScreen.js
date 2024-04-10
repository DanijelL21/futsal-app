import { Text, View, StyleSheet } from "react-native";
import { getMatchData } from "../../util/https";
import { useEffect, useState } from "react";

function MatchScreen() {
  const [time, setTime] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     data = getMatchData();
  //     console.l
  //     setTime(data.time); // log data.time
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.timeContainer}>
        <Text>{time}</Text>
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text>TEAM A</Text>
          <Text>{"homeGoals"}</Text>
        </View>
        <View style={styles.teamContainer}>
          <Text>TEAM B</Text>
          <Text>{"awayGoals"}</Text>
        </View>
      </View>
    </View>
  );
}

export default MatchScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },
  timeContainer: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  teamsContainer: {
    flex: 1,
    flexDirection: "row",
  },
  teamContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
});
