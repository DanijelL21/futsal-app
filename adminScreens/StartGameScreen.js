// External Libraries
import { Text, View, FlatList, StyleSheet, Alert } from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Internal Modules
import { getData, postData } from "../util/https";
import Background from "../components/Background";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import SecondaryButton from "../components/buttons/SecondaryButton";
import { BasicContext } from "../store/basic-context";
import { addFirebaseKey } from "../components/commonTranforms";
import GrupsDropdownMenu from "../components/GrupsDropdownMenu";
import LoadinSpinner from "../components/LoadingSpinner";
import NoItemsDisplayer from "../components/NoItemsDisplayer";

const GAMES_PADDING = dimensions.screenWidth * 0.0375;
const GAMES_FONT_SIZE = dimensions.screenWidth * 0.0375;

function StartGameScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);
  const [tournamentPhase, setTournamentPhase] = useState("Group Stage");
  const [loading, setLoading] = useState(true);

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  useFocusEffect(
    useCallback(() => {
      async function fetchGames() {
        try {
          const data = await getData(
            tournamentName,
            `games/${tournamentPhase}`
          );
          const games = addFirebaseKey(data);

          const filteredGames = games.filter(
            (game) => game !== null && !game.hasOwnProperty("score")
          );
          setGameList(filteredGames);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchGames();
    }, [tournamentPhase, navigation])
  );

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

  function startGame(game) {
    postData(
      tournamentName,
      {
        ...game,
        tournamentPhase: tournamentPhase,
      },
      "live"
    );
    navigation.navigate("LiveMatchScreen", {
      gameData: game,
      tournamentPhase: tournamentPhase,
    });
  }

  function renderGames(itemData) {
    return (
      <View style={styles.gamesContainer}>
        <SecondaryButton
          onPress={() =>
            Alert.alert(
              "Start Game",
              "Are you sure you want to start game?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Start",
                  style: "destructive",
                  onPress: () => startGame(itemData.item),
                },
              ],
              { cancelable: false }
            )
          }
          buttonStyle={styles.gamesButton}
        >
          <View style={styles.gameInfoRow}>
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.games}>{itemData.item.home}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.games}>VS</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.games}>{itemData.item.away}</Text>
            </View>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.games}>{itemData.item.date}</Text>
            <Text style={styles.games}>{itemData.item.time}</Text>
          </View>
        </SecondaryButton>
      </View>
    );
  }

  return (
    <Background>
      <GrupsDropdownMenu setSelectedPhase={setTournamentPhase} />
      {gameList.length === 0 ? (
        <>
          <NoItemsDisplayer text="NO GAMES FOR NOW" includeBackground={false} />
        </>
      ) : (
        <FlatList
          data={gameList}
          keyExtractor={(item) => item.id}
          renderItem={renderGames}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </Background>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  gamesContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
  },
  gamesButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.headerTextColor,
    paddingHorizontal: GAMES_PADDING,
    paddingVertical: GAMES_PADDING,
  },
  games: {
    color: colors.headerTextColor,
    fontSize: GAMES_FONT_SIZE,
    fontWeight: "bold",
  },
  gameInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTimeContainer: {
    alignItems: "center",
    marginTop: 15,
  },
});
