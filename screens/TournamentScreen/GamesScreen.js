import { Text, View, FlatList, StyleSheet } from "react-native";
import { getGames, getTeams, postData } from "../../util/https";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import Background from "../../components/Background";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import GrupsDropdownMenu from "../../components/GrupsDropdownMenu";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import generateGames from "../../components/GamesGenerator";
import LoadinSpinner from "../../components/LoadingSpinner";
const GAMES_PADDING = dimensions.screenWidth * 0.0375;
const GAMES_FONT_SIZE = dimensions.screenWidth * 0.0375;
const ADD_TEAM_PADDING = dimensions.screenWidth * 0.1;
const ADD_TEAM_FONT_SIZE = dimensions.screenWidth * 0.05;

function GamesScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);
  const [tournamentPhase, setTournamentPhase] = useState("Group Stage");
  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated();
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useFocusEffect(
    useCallback(() => {
      async function fetchGames() {
        try {
          const games = await getGames(tournament_name, tournamentPhase);
          const filteredGames = games.filter((game) => game !== null);
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

  function handleGameButtonPress(item) {
    if (item.hasOwnProperty("score")) {
      handleGameDetails(item);
    } else if (isAdmin) {
      modifyGame(item);
    }
  }
  function renderGames(itemData) {
    return (
      <View style={styles.gamesContainer}>
        <SecondaryButton
          onPress={() => handleGameButtonPress(itemData.item)}
          buttonStyle={styles.gamesButton}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.games}>{itemData.item.home}</Text>
            {itemData.item.hasOwnProperty("score") ? (
              <View style={styles.scoreContainer}>
                <Text style={styles.games}>{itemData.item.score[0]}</Text>
                <Text style={[styles.games, { marginHorizontal: 10 }]}>:</Text>
                <Text style={styles.games}>{itemData.item.score[1]}</Text>
              </View>
            ) : (
              <Text style={styles.games}>VS</Text>
            )}
            <Text style={styles.games}>{itemData.item.away}</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text style={styles.games}>{itemData.item.date}</Text>
            <Text style={styles.games}>{itemData.item.time} </Text>
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
          buttonText={"Add Game"}
          buttonStyle={styles.addGameButton}
          buttonTextStyle={styles.addGame}
        />
      </View>
    );
  }

  function addGames() {
    navigation.navigate("HandleGames", {
      torunamentPhase: tournamentPhase,
    });
  }

  function modifyGame(data) {
    navigation.navigate("HandleGames", {
      torunamentPhase: tournamentPhase,
      modifyGameData: data,
    });
  }

  function handleGameDetails(data) {
    console.log("DATA", data);
    navigation.navigate("GameStack", {
      screen: "MatchScreen",
      params: { firebaseKey: data.firebaseKey },
    });
  }

  return (
    <Background>
      <GrupsDropdownMenu setSelectedPhase={setTournamentPhase} />
      <FlatList
        data={gameList}
        keyExtractor={(item) => item.id}
        renderItem={renderGames}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
              No games for now
            </Text>
          </View>
        )}
        ListHeaderComponent={isAdmin ? addGameHandler : null}
      />
      {isAdmin && gameList.length == 0 && (
        <PrimaryButton
          onPress={() =>
            generateGames({ tournament_name, tournamentPhase, setGameList })
          }
          buttonText={"Generate Games"}
          buttonStyle={{ paddingVertical: 60, alignItems: "center" }}
          buttonTextStyle={{ color: "white" }}
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
  addGame: {
    color: colors.redNoticeColor,
    fontSize: ADD_TEAM_FONT_SIZE,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
