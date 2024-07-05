import { Text, View, StyleSheet, Button } from "react-native";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { getMatchEvents, getGame } from "../../util/https";
import { MatchEvents, goalsHandler } from "../../components/MatchEvents";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import Background from "../../components/Background";
import PrimaryButton from "../../components/buttons/PrimaryButton";

function MatchScreen({ navigation, route }) {
  const firebaseKey = route.params.firebaseKey;
  const [eventsList, setEventsList] = useState([]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState([0, 0]);
  const [gameData, setgameData] = useState({});
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  // FIX THIS !!
  useLayoutEffect(() => {
    console.log("GAME DATA", gameData);
    navigation.setOptions({
      headerLeft: () => (
        <PrimaryButton
          onPress={() => navigation.goBack()}
          buttonText="<"
          buttonTextStyle={{
            fontSize: 30,
            color: "white",
            marginLeft: 10,
            fontWeight: "bold",
          }}
        />
      ),
    });
  }, [navigation]);

  // get game data
  useEffect(() => {
    async function getGameData() {
      try {
        const game = await getGame(tournament_name, "Group Stage", firebaseKey);
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
        const fetchedEvents = await getMatchEvents(
          tournament_name,
          firebaseKey
        );
        setEventsList(fetchedEvents["events"]);
        setTime(fetchedEvents["time"]);
        const { homeGoals, awayGoals } = goalsHandler(fetchedEvents["events"]);
        setScore([homeGoals, awayGoals]);
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
          <Text style={styles.teamText}>{score[0]}</Text>
          <Text style={[styles.teamText, { marginHorizontal: 10 }]}>:</Text>
          <Text style={styles.teamText}>{score[1]}</Text>
        </View>
        <Text style={[styles.teamText, { textAlign: "right", flex: 1 }]}>
          {gameData?.away}
        </Text>
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents
          tournament_name={tournament_name}
          eventsList={eventsList}
        />
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
    color: "white",
    fontSize: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  time: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  eventListContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 2,
    borderTopColor: "lightgray",
  },
});
