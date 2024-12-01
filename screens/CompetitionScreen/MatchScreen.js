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
import PlayersModal from "../../components/PlayersModal";
import { Pressable } from "react-native";
function MatchScreen({ navigation, route }) {
  const firebaseKey = route.params.firebaseKey;
  const competitionPhase = route.params.competitionPhase;
  const isLive = route.params.isLive ?? true;
  const [eventsList, setEventsList] = useState([]);
  const [time, setTime] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTeam, setModalTeam] = useState("");
  const [score, setScore] = useState([0, 0]);
  const [gameInfo, setGameInfo] = useState({});
  const [opacity] = useState(new Animated.Value(1));
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;

  const gamesData = useFirebaseData(
    `${competitionName}/events/${firebaseKey}/`
  );

  // get game data
  useEffect(() => {
    async function getGameData() {
      try {
        const game = await getData(
          competitionName,
          `/games/${competitionPhase}/${firebaseKey}`
        );
        setGameInfo(game);
      } catch (error) {
        console.error("Error fetching team datajj:", error);
      }
    }
    getGameData();
  }, []);

  // fetch all teams data - THIS IS EXECUTED ONLY FIRST TIME
  useEffect(() => {
    async function fetchTeamData() {
      try {
        const data = await getData(competitionName, "teams");
        const teams = addFirebaseKey(data);
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
        console.error("Error fetching team dataaaaa:", error);
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
        setTime(competitionInfo.matchLength);
      } else {
        setTime(gamesData.time[timeKey].time);
      }
    }
  }, [gamesData, navigation]);

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

  function handleTeamPress(team) {
    setModalTeam(team);
    setModalVisible(true);
  }
  return (
    <Background>
      <PlayersModal
        visible={modalVisible}
        teamData={modalTeam === "home" ? homeTeam || {} : awayTeam || {}}
        onClose={() => {
          setModalVisible(false);
        }}
      />
      <View style={styles.timeContainer}>
        <Animated.Text style={[styles.time, { opacity }]}>
          {time}'
        </Animated.Text>
      </View>
      <View style={styles.teamsContainer}>
        <Pressable
          style={{ flex: 1, justifyContent: "center" }}
          onPress={() => handleTeamPress("home")}
        >
          <Text
            style={[styles.teamText, { textAlign: "left", flexShrink: 1 }]}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {homeTeam?.teamName}
          </Text>
        </Pressable>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score[0]}</Text>
          <Text style={[styles.scoreText, { marginHorizontal: 10 }]}>:</Text>
          <Text style={styles.scoreText}>{score[1]}</Text>
        </View>
        <Pressable
          style={{ flex: 1, justifyContent: "center" }}
          onPress={() => handleTeamPress("home")}
        >
          <Text
            style={[styles.teamText, { textAlign: "right", flexShrink: 1 }]}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {awayTeam?.teamName}
          </Text>
        </Pressable>
      </View>
      <View style={styles.eventListContainer}>
        <MatchEvents
          competitionName={competitionName}
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
