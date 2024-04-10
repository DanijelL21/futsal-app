import { Text, View, StyleSheet, Pressable } from "react-native";
import { postData } from "../util/https";
import PrimaryButton from "../components/Button";
import Stopwatch from "./components/Stopwatch";
import { useEffect, useState, useRef } from "react";
import makeBackendData from "../util/backendData";

async function sendToBackend(data, key) {
  await postData(data, key);
}

function LiveMatchScreen({ navigation, route }) {
  const gameData = route.params.gameData;
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
    console.log("GAME", gameData);
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

  // send data to firebase every 1 minute
  useEffect(() => {
    if (seconds !== 0 && seconds % 60 === 0) {
      const backendData = makeBackendData(
        homeGoals,
        awayGoals,
        Math.floor(seconds / 60)
      );
      sendToBackend(backendData);
    }
  }, [seconds]);

  // format time to have 00:00.
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
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text>
            {gameData.home} {homeGoals} : {awayGoals} {gameData.away}
          </Text>
        </View>
        <View style={styles.teamContainer}>
          <PrimaryButton
            onPress={() => addGoalsHandler("home")}
            buttonText={`${gameData.home.toUpperCase()} SCORED`}
          />
          <PrimaryButton
            onPress={() => addGoalsHandler("away")}
            buttonText={`${gameData.away.toUpperCase()} SCORED`}
          />
        </View>
      </View>
    </View>
  );
}

export default LiveMatchScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },
  timeContainer: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  teamsContainer: {
    justifyContent: "center",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 10,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
