import { Text, View, StyleSheet, Alert } from "react-native";
import Stopwatch from "./components/Stopwatch";
import { useEffect, useState, useContext } from "react";
import {
  getTeams,
  getMatchEvents,
  postData,
  updateData,
  deleteData,
} from "../util/https";
import PlayerListModal from "./components/PlayerListModal";
import { MatchEvents, goalsHandler } from "../components/MatchEvents";
import { BasicContext } from "../store/basic-context";
import Background from "../components/Background";
import IconButtonsList from "./components/IconButtonsList";
import PrimaryButton from "../components/buttons/PrimaryButton";
import IoniconsButton from "../components/buttons/IoniconsButton";
import TimeModifier from "./components/TimeModifier";
import LiveDropdownMenu from "./components/LiveDropdownMenu";
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";
function LiveMatchScreen({ navigation, route }) {
  const gameData = route.params.gameData;
  const tournamentPhase = route.params.tournamentPhase;
  const { seconds, handleToggle, setManualSeconds } = Stopwatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEvent, setModalEvent] = useState("");
  const [isModifyingTime, setIsModifyingTime] = useState(false);
  const [fetchEventsTrigger, setFetchEventsTrigger] = useState(true);
  const [eventsList, setEventsList] = useState([]);
  const [score, setScore] = useState([0, 0]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [matchMode, setmatchMode] = useState("Regular game");

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;
  const matchLength = tournamentInfo.matchLength;

  useEffect(() => {
    handleToggle();
  }, []);

  // fetch all teams data - THIS IS EXECUTED ONLY FIRST TIME
  useEffect(() => {
    async function fetchTeamData() {
      try {
        const teams = await getTeams(tournamentName);
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
        const fetchedEvents = await getMatchEvents(
          tournamentName,
          gameData["firebaseKey"]
        );

        // add mode to every dict
        const updatedEventsList = fetchedEvents["events"].map((event) => ({
          ...event,
          matchMode: matchMode,
        }));

        console.log(updatedEventsList);
        setEventsList(updatedEventsList);
        const { homeGoals, awayGoals } = goalsHandler(fetchedEvents["events"]);
        setScore([homeGoals, awayGoals]);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchEvents();
  }, [fetchEventsTrigger]);

  // SENDING DATA TO BACKEND

  // send data to firebase every 1 minute
  useEffect(() => {
    const sendSeconds = async () => {
      await postData(
        tournamentName,
        { time: Math.floor(seconds / 60) + 1 },
        `events/${gameData["firebaseKey"]}/time`
      );
    };

    if (seconds % 60 === 0) {
      sendSeconds();
    }
    // handle half time and end
    if (seconds !== 0 && seconds === (matchLength / 2) * 60) {
      handleToggle();
      Alert.alert("Half time");
    } else if (seconds !== 0 && seconds >= matchLength * 60) {
      handleToggle();
      Alert.alert("Full time");
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

  async function finishGame(score) {
    await updateData(
      tournamentName,
      { score: score },
      `games/${tournamentPhase}`,
      gameData["firebaseKey"]
    );

    deleteData(tournamentName, "live");

    // handle statistics...this will be in separate file
    if (tournamentPhase == "Group Stage") {
      // we want to update only when is grup
      // IDEA: ADD ONOTHER PREFIX tournamentSTAGE...that way we can tract statistics through whole tournament
      const updateTeamStatistics = (team, score, isHomeTeam) => {
        const [homeScore, awayScore] = score;
        const pg = team.statistics.pg + 1;
        const w =
          team.statistics.w +
          (isHomeTeam ? homeScore > awayScore : awayScore > homeScore ? 1 : 0);
        const l =
          team.statistics.l +
          (isHomeTeam ? awayScore > homeScore : homeScore > awayScore ? 1 : 0);
        const d =
          homeScore === awayScore ? team.statistics.d + 1 : team.statistics.d;
        const g = [
          team.statistics.g[0] + (isHomeTeam ? homeScore : awayScore),
          team.statistics.g[1] + (isHomeTeam ? awayScore : homeScore),
        ];
        const gd =
          (isHomeTeam ? homeScore - awayScore : awayScore - homeScore) +
          team.statistics.gd;
        const p =
          team.statistics.p +
          (homeScore > awayScore
            ? isHomeTeam
              ? 3
              : 0
            : homeScore < awayScore
            ? isHomeTeam
              ? 0
              : 3
            : 1);

        return { pg, w, l, d, g, gd, p };
      };

      const homeTeamStats = updateTeamStatistics(homeTeam, score, true);
      const awayTeamStats = updateTeamStatistics(awayTeam, score, false);

      updateData(
        tournamentName,
        homeTeamStats,
        "teams",
        `/${homeTeam.firebaseKey}/statistics`
      );
      updateData(
        tournamentName,
        awayTeamStats,
        "teams",
        `/${awayTeam.firebaseKey}/statistics`
      );
    }

    navigation.goBack();
  }

  const handleFinishGame = () => {
    Alert.alert(
      "Finish Game",
      "Are you sure you want to finish game?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          style: "destructive",
          onPress: () => finishGame(score),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Background>
      <LiveDropdownMenu setSelectedMode={setmatchMode} />
      <PlayerListModal
        tournamentName={tournamentName}
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
      <TimeModifier
        visible={isModifyingTime}
        seconds={seconds}
        matchLength={matchLength}
        setManualSeconds={setManualSeconds}
        onClose={() => {
          setIsModifyingTime(false);
        }}
      />
      <View style={styles.timeContainer}>
        <PrimaryButton
          onPress={handleToggle}
          buttonText={formatTime()}
          buttonTextStyle={styles.time}
        />
        <IoniconsButton
          icon={"settings-outline"}
          color={colors.redNoticeColor}
          size={dimensions.screenWidth * 0.05}
          onPress={() => setIsModifyingTime(true)}
          buttonStyle={{
            position: "absolute",
            right: dimensions.screenWidth * 0.3,
          }}
        />
      </View>
      <View style={styles.teamsContainer}>
        <Text style={[styles.teamText, { textAlign: "left", flex: 1 }]}>
          {homeTeam?.teamName}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.teamText}>{score[0]}</Text>
          <Text style={[styles.teamText, { marginHorizontal: 10 }]}>:</Text>
          <Text style={styles.teamText}>{score[1]}</Text>
        </View>
        <Text style={[styles.teamText, { textAlign: "right", flex: 1 }]}>
          {awayTeam?.teamName}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <IconButtonsList
          team="home"
          mode={matchMode}
          seconds={seconds}
          handleIconPress={handleIconPress}
        />
        <IconButtonsList
          team="away"
          mode={matchMode}
          seconds={seconds}
          handleIconPress={handleIconPress}
        />
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents
          tournamentName={tournamentName}
          eventsList={eventsList}
          matchMode={matchMode}
          handleDeleteEvent={() => setFetchEventsTrigger((current) => !current)}
        />
      </View>
      <View style={styles.finishButtonContainer}>
        <PrimaryButton
          onPress={handleFinishGame}
          buttonText="Finish game"
          buttonStyle={styles.finishGameButton}
          buttonTextStyle={styles.finishGameText}
        />
      </View>
    </Background>
  );
}

export default LiveMatchScreen;

const styles = StyleSheet.create({
  timeContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
    paddingBottom: dimensions.screenWidth * 0.06,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
  },
  teamsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  teamText: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.05,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: dimensions.screenWidth * 0.02,
    marginBottom: dimensions.screenWidth * 0.02,
  },
  time: {
    fontSize: dimensions.screenWidth * 0.06,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  eventListContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "lightgray",
  },
  finishButtonContainer: {
    marginTop: dimensions.screenWidth * 0.02,
    marginBottom: "10%",
  },
  finishGameButton: {
    padding: dimensions.screenWidth * 0.02,
    borderRadius: 5,
    alignItems: "center",
  },
  finishGameText: {
    color: colors.redNoticeColor,
    fontSize: dimensions.screenWidth * 0.07,
  },
});
