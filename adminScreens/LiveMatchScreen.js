// External Libraries
import { Text, View, StyleSheet, Alert } from "react-native";
import { useEffect, useState, useContext } from "react";

// Internal Modules
import Stopwatch from "./components/Stopwatch";
import PlayerListModal from "./components/PlayerListModal";
import { MatchEvents, goalsHandler } from "../components/MatchEvents";
import Background from "../components/Background";
import IconButtonsList from "./components/IconButtonsList";
import PrimaryButton from "../components/buttons/PrimaryButton";
import IoniconsButton from "../components/buttons/IoniconsButton";
import TimeModifier from "./components/TimeModifier";
import LiveDropdownMenu from "./components/LiveDropdownMenu";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import { addFirebaseKey } from "../components/commonTranforms";
import { BasicContext } from "../store/basic-context";
import { postData, updateData, deleteData, getData } from "../util/https";
import GenerateTeamStatistics from "./components/StatisticsCreator";

function LiveMatchScreen({ navigation, route }) {
  const gameData = route.params.gameData;
  const competitionPhase = route.params.competitionPhase;
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
  const [timeEntryKey, setTimeEntryKey] = useState(null);

  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;
  const matchLength = competitionInfo.matchLength;

  // TO UNDERSTAND DATA FLOW IN THIS SCREEN, SEE README
  useEffect(() => {
    handleToggle();
  }, []);

  // fetch all teams data - THIS IS EXECUTED ONLY FIRST TIME
  useEffect(() => {
    async function fetchTeamData() {
      try {
        const data = await getData(competitionName, "teams");
        const teams = addFirebaseKey(data);
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

  function handleEventsData(data, firebaseKey) {
    const events = [];
    let time = null;

    if (data == null) {
      return { events, time };
    } else {
      Object.keys(data).forEach((key) => {
        if (key !== "time") {
          const eventObject = {
            eventKey: key,
            firebaseKey: firebaseKey,
            ...data[key],
          };
          console.log("EVENT OBJECT", eventObject);
          events.push(eventObject);
          // EVENTS ARE PUSHED IN ICON BUTTONS OR MODAL???. THIS IS JUST FOR DISPLAYING.
        } else {
          const timeKeys = Object.keys(data[key]);
          if (timeKeys.length > 0) {
            time = data[key][timeKeys[timeKeys.length - 1]].time;
          }
        }
      });
      return { events, time };
    }
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getData(
          competitionName,
          `events/${gameData["firebaseKey"]}`
        );

        transformedEvents = handleEventsData(
          fetchedEvents,
          gameData["firebaseKey"],
          matchMode
        );

        console.log("TRANSFORMED EVENTS", transformedEvents);
        setEventsList(transformedEvents["events"]);
        const { homeGoals, awayGoals } = goalsHandler(
          transformedEvents["events"]
        );
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
      data = { time: Math.floor(seconds / 60) + 1 };
      urlPath = `events/${gameData["firebaseKey"]}/time`;

      if (!timeEntryKey) {
        const response = await postData(competitionName, data, urlPath);

        setTimeEntryKey(response.data.name);
      } else {
        updateData(competitionName, data, `${urlPath}/${timeEntryKey}`);
      }
    };

    if (seconds % 60 === 0) {
      sendSeconds();
    }

    if (matchMode != "Regular game") {
      handleToggle();
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
    console.log("MODAL EVENT", modalEvent);
    setModalEvent(modalEvent);
    setModalVisible(true);
  }

  function checkAdvantage(advantagePenaltyEvents) {
    let homeScore = 0;
    let awayScore = 0;

    advantagePenaltyEvents.forEach((event) => {
      if (event.event === "penaltyScored") {
        if (event.team === "home") {
          homeScore++;
        } else if (event.team === "away") {
          awayScore++;
        }
      }
    });

    // Determine the winner
    if (homeScore > awayScore) {
      return "home";
    } else if (awayScore > homeScore) {
      return "away";
    } else {
      return "";
    }
  }

  function finishGame(score) {
    const advantagePenaltyEvents = eventsList.filter(
      (event) => event.mode === "Advantage penalty"
    );
    // update score
    updateData(
      competitionName,
      {
        score: score,
        ...(advantagePenaltyEvents.length > 0 && {
          advantage: checkAdvantage(advantagePenaltyEvents),
        }),
      },
      `games/${competitionPhase}/${gameData["firebaseKey"]}`
    );

    // update statistics
    const homeTeamCopy = { ...homeTeam };
    const awayTeamCopy = { ...awayTeam };

    const { updatedHomeTeam, updatedAwayTeam } = GenerateTeamStatistics(
      homeTeamCopy,
      awayTeamCopy,
      eventsList,
      competitionPhase,
      competitionInfo.mode,
      score
    );

    updateData(
      competitionName,
      updatedHomeTeam,
      `teams/${homeTeam.firebaseKey}`
    );
    updateData(
      competitionName,
      updatedAwayTeam,
      `teams/${awayTeam.firebaseKey}`
    );

    // delete live match flag
    deleteData(competitionName, "live");

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
        competitionName={competitionName}
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
          competitionName={competitionName}
          eventsList={eventsList}
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
