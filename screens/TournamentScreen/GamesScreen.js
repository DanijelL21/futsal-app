import { Text, View, FlatList } from "react-native";
import { getGames } from "../../util/https";
import { useState, useEffect } from "react";
import GamesButton from "./components/GamesButton";
function GamesScreen() {
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const games = await getGames();
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
      <GamesButton
        onPress={() => console.log("navigate or not based on game")}
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

export default GamesScreen;
