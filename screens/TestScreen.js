import { Text, View, FlatList, Button, StyleSheet } from "react-native";
import TournamentButton from "../components/TournamentButton";
import { useEffect } from "react";
import { postData } from "../util/https";

async function sendToBackend(data, key) {
  await postData(data, key);
}

function TestScreen() {
  function putTeams(params) {
    sendToBackend(
      {
        1: { id: 1, team: "test_team", group: "A" },
        2: { id: 2, team: "test_team_two", group: "A" },
        3: { id: 3, team: "test_team_three", group: "A" },
        4: { id: 4, team: "test_team_four", group: "C" },
        5: { id: 5, team: "test_team_five", group: "B" },
        6: { id: 6, team: "test_team_six", group: "B" },
        7: { id: 7, team: "seven", group: "B" },
      },
      "teams"
    );
  }

  // function putGames(params) {
  //   sendToBackend(
  //     {
  //       1: { id: 1, home: "test_team", away: "test_team_two", score: null },
  //       2: { id: 2, home: "test_team_two", away: "test_team", score: null },
  //       3: {
  //         id: 3,
  //         home: "test_team_six",
  //         away: "test_team_five",
  //         score: null,
  //       },
  //       4: { id: 4, home: "test_team_three", away: "test_team", score: null },
  //     },
  //     "games"
  //   );
  // }

  function putGames(params) {
    sendToBackend(
      {
        id: 1,
        home: "test_team",
        away: "test_team_two",
        score: null,
        time: "17:00",
      },
      "games"
    );
    sendToBackend(
      {
        id: 2,
        home: "test_team",
        away: "test_team_three",
        score: null,
        time: "17:45",
      },
      "games"
    );
    sendToBackend(
      {
        id: 3,
        home: "test_team_two",
        away: "test_team_three",
        score: null,
        time: "18:30",
      },
      "games"
    );
  }

  return (
    <View style={styles.container}>
      <Button onPress={putTeams} title="PUT TEAMS" color="blue" />
      <Button onPress={putGames} title="PUT GAMES" color="blue" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TestScreen;
