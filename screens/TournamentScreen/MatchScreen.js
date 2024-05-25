import { Text, View, StyleSheet, Button } from "react-native";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { getMatchEvents } from "../../util/https";
import { MatchEvents, goalsHandler } from "../../components/MatchEvents";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";

function MatchScreen({ navigation, route }) {
  const gameData = route.params.gameData;
  const [eventsList, setEventsList] = useState([]);
  const [time, setTime] = useState(0);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useLayoutEffect(() => {
    console.log("F", gameData);
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => navigation.goBack()}
          title="Back"
          color="black"
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getMatchEvents(
          tournament_name,
          gameData["firebaseKey"]
        );
        setEventsList(fetchedEvents["events"]);
        setTime(fetchedEvents["time"]);
        const { homeGoals, awayGoals } = goalsHandler(fetchedEvents["events"]);
        setHomeGoals(homeGoals);
        setAwayGoals(awayGoals);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}'</Text>
      </View>
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Text>
            {gameData.home} {homeGoals}
          </Text>
        </View>
        <View style={styles.teamContainer}>
          <Text>
            {awayGoals} {gameData.away}
          </Text>
        </View>
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents eventsList={eventsList} />
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
  time: {
    fontSize: 24,
    fontWeight: "bold",
  },
  timeContainer: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  teamsContainer: {
    flexDirection: "row",
    paddingBottom: 50,
  },
  teamContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
  eventListContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 3,
    borderTopColor: "lightgray",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
});
