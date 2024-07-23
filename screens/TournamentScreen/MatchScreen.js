import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState, useContext } from "react";
import { getMatchEvents, getGame, getData } from "../../util/https";
import { MatchEvents, goalsHandler } from "../../components/MatchEvents";
import { BasicContext } from "../../store/basic-context";
import Background from "../../components/Background";
import colors from "../../constants/colors";
function MatchScreen({ navigation, route }) {
  const firebaseKey = route.params.firebaseKey;
  const tournamentPhase = route.params.tournamentPhase;
  const isLive = route.params.isLive ?? true;
  const [eventsList, setEventsList] = useState([]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState([0, 0]);
  const [gameData, setgameData] = useState({});

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  // get game data
  useEffect(() => {
    async function getGameData() {
      try {
        console.log("FIREBASE KEY", firebaseKey);
        const game = await getGame(
          tournamentName,
          tournamentPhase,
          firebaseKey
        );
        console.log("GAME DATA", game);
        setgameData(game);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }
    getGameData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getMatchEvents(tournamentName, firebaseKey);
        console.log("fetchedEvents", fetchedEvents);
        setEventsList(fetchedEvents["events"]);
        const { homeGoals, awayGoals } = goalsHandler(fetchedEvents["events"]);
        setScore([homeGoals, awayGoals]);
        console.log("ISLIVE", isLive);
        if (isLive === false) {
          setTime(tournamentInfo.matchLength);
        } else {
          setTime(fetchedEvents["time"]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 20000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Background>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}'</Text>
      </View>
      <View style={styles.teamsContainer}>
        <Text style={[styles.teamText, { textAlign: "left", flex: 1 }]}>
          {gameData?.home}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score[0]}</Text>
          <Text style={[styles.scoreText, { marginHorizontal: 10 }]}>:</Text>
          <Text style={styles.scoreText}>{score[1]}</Text>
        </View>
        <Text style={[styles.teamText, { textAlign: "right", flex: 1 }]}>
          {gameData?.away}
        </Text>
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents tournamentName={tournamentName} eventsList={eventsList} />
      </View>
    </Background>
  );
}

export default MatchScreen;

const styles = StyleSheet.create({
  timeContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    alignContent: "center",
    alignItems: "center",
  },
  teamsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 30,
  },
  teamText: {
    color: colors.headerTextColor,
    fontSize: 20,
    margin: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  scoreText: {
    color: colors.headerTextColor,
    fontSize: 20,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  eventListContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "lightgray",
  },
});
