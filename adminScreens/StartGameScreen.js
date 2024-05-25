import { Text, View, FlatList, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useContext } from "react";
import { getGames } from "../util/https";
import Background from "../components/Background";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import SecondaryButton from "../components/SecondaryButton";
import { BasicContext } from "../store/basic-context";
const GAMES_PADDING = dimensions.screenWidth * 0.0375;
const GAMES_FONT_SIZE = dimensions.screenWidth * 0.0375;

function StartGameScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);

  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useEffect(() => {
    async function fetchGames() {
      try {
        const games = await getGames(tournament_name);
        const filteredGames = games.filter((game) => game !== null);
        filteredGames.sort((a, b) => (a.time > b.time ? 1 : -1));
        setGameList(filteredGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    }
    fetchGames();
  }, []);

  function startGame(game) {
    navigation.navigate("LiveMatchScreen", {
      gameData: game,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.games}>{itemData.item.home}</Text>
            <Text style={styles.games}>VS</Text>
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

  return (
    <Background>
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
      />
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
});
