import { Text, View, FlatList, Button, StyleSheet } from "react-native";
import { useEffect } from "react";
import { postData } from "../util/https";
import dimensions from "../constants/dimensions";

// for ipad console.log(dimensions.screenWidth, dimensions.screenHeight); 1024 768
async function sendToBackend(data, key) {
  await postData(data, key);
}

function TestScreen() {
  useEffect(() => {
    console.log(dimensions.screenWidth, dimensions.screenHeight);
  }, []);
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
        home: "New team 1",
        away: "New team 2",
        score: null,
        date: "21.1.2024",
        time: "17:00",
      },
      "games"
    );
    sendToBackend(
      {
        id: 2,
        home: "New team 1",
        away: "New team 3",
        score: null,
        date: "21.1.2024",
        time: "17:45",
      },
      "games"
    );
    sendToBackend(
      {
        id: 3,
        home: "New team 2",
        away: "New team 3",
        score: null,
        date: "21.1.2024",
        time: "18:30",
      },
      "games"
    );
  }

  function sendMail(params) {
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

  return (
    <View style={styles.container}>
      <Button onPress={putTeams} title="PUT TEAMS" color="blue" />
      <Button onPress={putGames} title="PUT GAMES" color="blue" />
      <Button onPress={sendMail} title="SEND MAIL" color="blue" />
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
