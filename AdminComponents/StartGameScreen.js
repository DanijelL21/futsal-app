import { Text, View, FlatList, Alert } from "react-native";
import GamesButton from "../screens/TournamentScreen/components/GamesButton";
import { useState, useEffect } from "react";
import { getGames } from "../util/https";

function StartGameScreen({ navigation, route }) {
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const games = await getGames();
        console.log(games);
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
      <GamesButton
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
        game={itemData.item}
      />
    );
  }

  return (
    <FlatList
      data={gameList}
      keyExtractor={(item) => item.id}
      renderItem={renderGames}
    />
  );
}

export default StartGameScreen;
