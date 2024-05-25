import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import Stopwatch from "./components/Stopwatch";
import { useEffect, useState } from "react";
import { getTeams, getMatchEvents, postData } from "../util/https";
import IconsButton from "./components/IconsButton.js";
import PlayerListModal from "./components/PlayerListModal";
import { MatchEvents, goalsHandler } from "../components/MatchEvents";
async function sendSeconds(data, key) {
  await postData(data, `events/${key}`);
}

function LiveMatchScreen({ navigation, route }) {
  const gameData = route.params.gameData;
  const { seconds, handleToggle } = Stopwatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEvent, setModalEvent] = useState("");
  const [fetchEventsTrigger, setFetchEventsTrigger] = useState(true);
  const [eventsList, setEventsList] = useState([]);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  // fetch all teams data - THIS IS EXECUTED ONLY FIRST TIME
  useEffect(() => {
    async function fetchTeamData() {
      try {
        const teams = await getTeams();
        const homeTeamData = teams.find(
          (team) => team.teamName === gameData["home"]
        );
        const awayTeamData = teams.find(
          (team) => team.teamName === gameData["away"]
        );

        if (homeTeamData) {
          setHomeTeam(homeTeamData);
        }

        if (awayTeamData) {
          setAwayTeam(awayTeamData);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }

    fetchTeamData();
  }, [gameData]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getMatchEvents(gameData["firebaseKey"]);
        setEventsList(fetchedEvents["events"]);
        const { homeGoals, awayGoals } = goalsHandler(fetchedEvents["events"]);
        setHomeGoals(homeGoals);
        setAwayGoals(awayGoals);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchEvents();
  }, [fetchEventsTrigger]);

  // SENDING DATA TO BACKEND

  // send data to firebase every 1 minute
  useEffect(() => {
    if (seconds % 60 === 0) {
      sendSeconds(
        { time: Math.floor(seconds / 60) + 1 },
        gameData["firebaseKey"] + "/time"
      );
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

  function handleIconPress(modalEvent) {
    setModalEvent(modalEvent);
    setModalVisible(true);
  }

  const handleFinishGame = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.outerContainer}>
      <PlayerListModal
        visible={modalVisible}
        event={modalEvent}
        firebaseKey={gameData["firebaseKey"]}
        players={
          modalEvent.team === "home"
            ? homeTeam?.players || []
            : awayTeam?.players || []
        }
        onClose={() => {
          setModalVisible(false);
          setFetchEventsTrigger((currentValue) => !currentValue);
        }}
      />
      <View style={styles.timeContainer}>
        <Pressable onPress={handleToggle}>
          <Text style={styles.time}>{formatTime()}</Text>
        </Pressable>
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text>
            {homeTeam?.teamName} {homeGoals} :
          </Text>
          <View style={styles.buttonContainer}>
            <IconsButton
              icon="football"
              color="black"
              onPress={() =>
                handleIconPress({
                  event: "goal",
                  team: "home",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="square"
              color="yellow"
              onPress={() =>
                handleIconPress({
                  event: "yellow card",
                  team: "home",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="square"
              color="red"
              onPress={() =>
                handleIconPress({
                  event: "red card",
                  team: "home",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="football"
              color="red"
              onPress={() =>
                handleIconPress({
                  event: "own goal",
                  team: "home",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
          </View>
        </View>
        <View style={styles.teamContainer}>
          <Text>
            {awayGoals} {awayTeam?.teamName}
          </Text>
          <View style={styles.buttonContainer}>
            <IconsButton
              icon="football"
              color="black"
              onPress={() =>
                handleIconPress({
                  event: "goal",
                  team: "away",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="square"
              color="yellow"
              onPress={() =>
                handleIconPress({
                  event: "yellow card",
                  team: "away",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="square"
              color="red"
              onPress={() =>
                handleIconPress({
                  event: "red card",
                  team: "away",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
            <IconsButton
              icon="football"
              color="red"
              onPress={() =>
                handleIconPress({
                  event: "own goal",
                  team: "away",
                  time: Math.floor(seconds / 60) + 1,
                })
              }
            />
          </View>
        </View>
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents
          eventsList={eventsList}
          handleDeleteEvent={() => setFetchEventsTrigger((current) => !current)}
        />
      </View>
      <View style={styles.finishButtonContainer}>
        <Pressable onPress={handleFinishGame} style={styles.goBack}>
          <Text>Finish game</Text>
        </Pressable>
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
    justifyContent: "space-between",
    flexDirection: "row",
  },
  singleTeamContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
  eventListContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  finishButtonContainer: {
    marginTop: 10,
    marginBottom: "10%",
  },
  goBack: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
