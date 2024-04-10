import { Text, View, StyleSheet, Pressable } from "react-native";
import { postData } from "../util/https";
import PrimaryButton from "../components/Button";
import Stopwatch from "../components/Stopwatch";
import { useEffect, useState, useRef } from "react";
import makeBackendData from "../util/backendData";

async function sendToBackend(data) {
  await postData(data);
}

function StartGameScreen() {
  const { seconds, handleToggle } = Stopwatch();
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  function addGoalsHandler(team) {
    if (team === "home") {
      setHomeGoals((prevHomeGoals) => prevHomeGoals + 1);
    } else {
      setAwayGoals((prevAwayGoals) => prevAwayGoals + 1);
    }
  }

  // SENDING DATA TO BACKEND

  // when goal is scored
  useEffect(() => {
    if (homeGoals != 0 || awayGoals != 0) {
      const backendData = makeBackendData(
        homeGoals,
        awayGoals,
        Math.floor(seconds / 60)
      );
      console.log(backendData);
      sendToBackend(backendData);
    }
  }, [homeGoals, awayGoals]);

  // when minutes are changed
  useEffect(() => {
    if (seconds !== 0 && seconds % 60 === 0) {
      console.log("ENTERED");
      const backendData = makeBackendData(
        homeGoals,
        awayGoals,
        Math.floor(seconds / 60)
      );
      sendToBackend(backendData);
    }
  }, [seconds]);

  // STOPWATCH PART

  function formatTime() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.timeContainer}>
        <Pressable onPress={handleToggle}>
          <Text style={styles.time}>{formatTime()}</Text>
        </Pressable>
        <Text>{seconds}</Text>
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text>TEAM A</Text>
          <PrimaryButton
            onPress={() => addGoalsHandler("home")}
            buttonText={"TEAM A SCORED"}
          />
          <Text>{homeGoals}</Text>
        </View>
        <View style={styles.teamContainer}>
          <Text>TEAM B</Text>
          <PrimaryButton
            onPress={() => addGoalsHandler()}
            buttonText={"TEAM B SCORED"}
          />
          <Text>{awayGoals}</Text>
        </View>
      </View>
    </View>
  );
}

export default StartGameScreen;

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
