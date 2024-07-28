// External Libraries
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Internal Modules
import { getData } from "../../util/https";
import { addFirebaseKey } from "../../components/commonTranforms";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import Background from "../../components/Background";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import GrupsDropdownMenu from "../../components/GrupsDropdownMenu";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import generateGames from "../../components/GamesGenerator";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";

const GAMES_PADDING = dimensions.screenWidth * 0.0375;
const GAMES_FONT_SIZE = dimensions.screenWidth * 0.0375;
const ADD_TEAM_PADDING = dimensions.screenWidth * 0.1;
const ADD_TEAM_FONT_SIZE = dimensions.screenWidth * 0.05;

function GamesScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);
  const [tournamentPhase, setTournamentPhase] = useState("Group Stage");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  const isAdmin = authCtx.isAuthenticated(tournamentName);

  useFocusEffect(
    useCallback(() => {
      async function fetchGames() {
        try {
          const data = await getData(
            tournamentName,
            `games/${tournamentPhase}`
          );
          const games = addFirebaseKey(data);

          const filteredGames = games.filter((game) => game !== null);
          setGameList(filteredGames);
        } catch (error) {
          console.error("Error fetching games:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchGames();
    }, [tournamentPhase, navigation])
  );

  if (loading || generating) {
    return (
      <Background>
        <LoadingSpinner />
      </Background>
    );
  }

  function handleGameButtonPress(item) {
    if (item.hasOwnProperty("score")) {
      handleGameDetails(item);
    } else if (isAdmin) {
      modifyGame(item);
    }
  }

  function renderGames({ item }) {
    return (
      <View style={styles.gamesContainer}>
        <SecondaryButton
          onPress={() => handleGameButtonPress(item)}
          buttonStyle={styles.gamesButton}
        >
          <View style={styles.gameInfoRow}>
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.games}>{item.home}</Text>
            </View>
            <View style={styles.scoreContainer}>
              {item.hasOwnProperty("score") ? (
                <>
                  <Text style={styles.games}>{item.score[0]}</Text>
                  <Text style={styles.gamesSeparator}>:</Text>
                  <Text style={styles.games}>{item.score[1]}</Text>
                </>
              ) : (
                <Text style={styles.games}>VS</Text>
              )}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.games}>{item.away}</Text>
            </View>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.games}>{item.date}</Text>
            <Text style={styles.games}>{item.time}</Text>
          </View>
        </SecondaryButton>
      </View>
    );
  }

  function addGameHandler() {
    return (
      <View style={styles.addGameContainer}>
        <PrimaryButton
          onPress={addGames}
          buttonText="Add Game"
          buttonStyle={styles.addGameButton}
          buttonTextStyle={styles.addGameText}
        />
      </View>
    );
  }

  function addGames() {
    navigation.navigate("HandleGames", {
      tournamentPhase: tournamentPhase,
    });
  }

  function modifyGame(data) {
    navigation.navigate("HandleGames", {
      tournamentPhase: tournamentPhase,
      modifyGameData: data,
    });
  }

  function handleGameDetails(data) {
    console.log("DATA", data);
    navigation.navigate("MatchScreen", {
      firebaseKey: data.firebaseKey,
      tournamentPhase: tournamentPhase,
      isLive: false,
    });
  }

  async function handleGenerateGames() {
    setGenerating(true);
    try {
      await generateGames({ tournamentName, tournamentPhase, setGameList });
    } catch (error) {
      console.error("Error generating games:", error);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Background>
      <GrupsDropdownMenu setSelectedPhase={setTournamentPhase} />
      {gameList.length === 0 ? (
        <>
          {isAdmin && addGameHandler()}
          <NoItemsDisplayer text="NO GAMES FOR NOW" includeBackground={false} />
        </>
      ) : (
        <FlatList
          data={gameList}
          keyExtractor={(item) => item.id}
          renderItem={renderGames}
          ListHeaderComponent={isAdmin ? addGameHandler : null}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
      {isAdmin && gameList.length == 0 && (
        <PrimaryButton
          onPress={handleGenerateGames}
          buttonText="Generate Games"
          buttonStyle={styles.generateGamesButton}
          buttonTextStyle={styles.generateGamesText}
        />
      )}
    </Background>
  );
}

export default GamesScreen;

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
  addGameContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
    alignItems: "center",
  },
  addGameButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.redNoticeColor,
    paddingHorizontal: ADD_TEAM_PADDING,
    paddingVertical: ADD_TEAM_PADDING / 4,
  },
  addGameText: {
    color: colors.redNoticeColor,
    fontSize: ADD_TEAM_FONT_SIZE,
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
  gamesSeparator: {
    marginHorizontal: 10,
    color: colors.headerTextColor,
  },
  dateTimeContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  generateGamesButton: {
    paddingVertical: 60,
    alignItems: "center",
  },
  generateGamesText: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.05,
  },
});
