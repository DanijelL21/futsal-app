// External Libraries
import { Text, View, StyleSheet, Animated } from "react-native";
import { useEffect, useState, useContext } from "react";

// Internal Modules
import { getData } from "../../util/https";
import { MatchEvents, goalsHandler } from "../../components/MatchEvents";
import { BasicContext } from "../../store/basic-context";
import Background from "../../components/Background";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import { useFirebaseData } from "../../components/useFirebaseData";
import { addFirebaseKey } from "../../components/commonTranforms";
function MatchScreen({ navigation, route }) {
  const firebaseKey = route.params.firebaseKey;
  const tournamentPhase = route.params.tournamentPhase;
  const isLive = route.params.isLive ?? true;
  const [eventsList, setEventsList] = useState([]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState([0, 0]);
  const [gameInfo, setGameInfo] = useState({});
  const [opacity] = useState(new Animated.Value(1));
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  const gamesData = useFirebaseData(`${tournamentName}/events/${firebaseKey}/`);

  // get game data
  useEffect(() => {
    async function getGameData() {
      try {
        const game = await getData(
          tournamentName,
          `/games/${tournamentPhase}/${firebaseKey}`
        );
        console.log("GAME", game);
        setGameInfo(game);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }
    getGameData();
  }, []);

  // fetch all teams data - THIS IS EXECUTED ONLY FIRST TIME
  useEffect(() => {
    async function fetchTeamData() {
      try {
        const data = await getData(tournamentName, "teams");
        const teams = addFirebaseKey(data);
        console.log("TTT", teams);
        const homeTeamData = teams.find(
          (team) => team.teamName === gameInfo["home"]
        );
        const awayTeamData = teams.find(
          (team) => team.teamName === gameInfo["away"]
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
  }, [gameInfo]);

  useEffect(() => {
    const events = [];

    if (gamesData) {
      Object.keys(gamesData).forEach((key) => {
        if (key !== "time") {
          const eventObject = {
            eventKey: key,
            firebaseKey: firebaseKey,
            ...gamesData[key],
          };
          events.push(eventObject);
        }
      });

      const timeKey = Object.keys(gamesData.time)[0];

      setEventsList(events);
      const { homeGoals, awayGoals } = goalsHandler(events);
      setScore([homeGoals, awayGoals]);
      if (isLive === false) {
        setTime(tournamentInfo.matchLength);
      } else {
        setTime(gamesData.time[timeKey].time);
      }
    }
  }, [gamesData]);

  // Blinking time effect
  useEffect(() => {
    if (isLive) {
      const blink = () => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      };

      const blinkInterval = setInterval(blink, 2000); // Blink every 2 seconds
      return () => clearInterval(blinkInterval);
    } else {
      opacity.setValue(1);
    }
  }, [isLive]);

  return (
    <Background>
      <View style={styles.timeContainer}>
        <Animated.Text style={[styles.time, { opacity }]}>
          {time}'
        </Animated.Text>
      </View>
      <View style={styles.teamsContainer}>
        <Text style={[styles.teamText, { textAlign: "left", flex: 1 }]}>
          {homeTeam?.teamName}
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score[0]}</Text>
          <Text style={[styles.scoreText, { marginHorizontal: 10 }]}>:</Text>
          <Text style={styles.scoreText}>{score[1]}</Text>
        </View>
        <Text style={[styles.teamText, { textAlign: "right", flex: 1 }]}>
          {awayTeam?.teamName}
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
    fontSize: dimensions.screenWidth * 0.05,
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
