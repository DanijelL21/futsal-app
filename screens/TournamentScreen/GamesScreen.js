import { Text, View, FlatList, StyleSheet } from "react-native";
import { getGames, getTeams, postData } from "../../util/https";
import { useState, useEffect, useContext } from "react";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import Background from "../../components/Background";
import SecondaryButton from "../../components/SecondaryButton";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import PrimaryButton from "../../components/PrimaryButton";
const GAMES_PADDING = dimensions.screenWidth * 0.0375;
const GAMES_FONT_SIZE = dimensions.screenWidth * 0.0375;

function GamesScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);

  // const authCtx = useContext(AuthContext);
  // const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  function gamesDetailsNavigation(data) {
    navigation.navigate("GameStack", {
      screen: "MatchScreen",
      params: { gameData: data },
    });
  }

  useEffect(() => {
    async function fetchGames() {
      try {
        const games = await getGames(tournament_name);
        const filteredGames = games.filter((game) => game !== null);
        // filteredTeams.sort((a, b) => (a.group > b.group ? 1 : -1));
        setGameList(filteredGames);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchGames();
  }, []);

  function renderGames(itemData) {
    return (
      <View style={styles.gamesContainer}>
        <SecondaryButton
          onPress={() => gamesDetailsNavigation(itemData.item)}
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

  async function generateGames() {
    const teams = await getTeams(tournament_name);
    const generateGroupGames = (teams) => {
      // Group teams by their group identifier
      const groups = teams.reduce((acc, team) => {
        if (!acc[team.group]) {
          acc[team.group] = [];
        }
        acc[team.group].push({ team: team.teamName, id: team.id });
        return acc;
      }, {});
      const games = [];
      Object.keys(groups).forEach((group) => {
        const groupTeams = groups[group];
        for (let i = 0; i < groupTeams.length; i++) {
          for (let j = i + 1; j < groupTeams.length; j++) {
            games.push({
              home: groupTeams[i]["team"],
              away: groupTeams[j]["team"],
              date: "TBD",
              time: "TBD",
              id: `${groupTeams[i]["id"]}${groupTeams[j]["id"]}`,
            });
          }
        }
      });
      return games;
    };

    const games = generateGroupGames(teams);
    for (const game of games) {
      await postData(tournament_name, game, "games");
    }
    setGameList(games);
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
      <PrimaryButton
        onPress={generateGames}
        buttonText={"Generate Games"}
        buttonStyle={{ paddingVertical: 60, alignItems: "center" }}
        buttonTextStyle={{ color: "white" }}
      />
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
});
