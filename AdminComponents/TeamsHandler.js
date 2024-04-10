import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Button from "./components/Button";
import { postData, updateData } from "../util/https";

const nrOfPlayers = 13;

async function addTeam(data) {
  await postData(data, "teams");
}

async function modifyTeam(data, id) {
  await updateData(data, "teams", id);
}

function TeamsHandler({ navigation, route }) {
  const nrOfTeams = route.params.nrOfTeams;
  const modifyTeamData = route.params.modifyTeamData;
  const [teamData, setTeamData] = useState({
    id: modifyTeamData ? modifyTeamData.id : nrOfTeams + 1,
    teamName: modifyTeamData ? modifyTeamData.teamName : "",
    manager: modifyTeamData ? modifyTeamData.manager : "",
    group: modifyTeamData ? modifyTeamData.group : "TBD",
    players: modifyTeamData
      ? modifyTeamData.players
      : Array.from({ length: nrOfPlayers }, (_, index) => ({
          number: (index + 1).toString(),
          name: "",
        })),
  });

  useEffect(() => {
    if (modifyTeamData !== undefined) {
      navigation.setOptions({
        title: "Modify Team",
      });
    }
  }, [modifyTeamData, navigation]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setTeamData((curInputs) => {
      if (
        inputIdentifier === "teamName" ||
        inputIdentifier === "manager" ||
        inputIdentifier === "group"
      ) {
        return {
          ...curInputs,
          [inputIdentifier]: enteredValue,
        };
      } else if (inputIdentifier.startsWith("player")) {
        const index = parseInt(inputIdentifier.split("-")[1]);
        const updatedPlayers = [...curInputs.players];
        updatedPlayers[index].name = enteredValue;
        return {
          ...curInputs,
          players: updatedPlayers,
        };
      }
      return curInputs;
    });
  }

  function addTeamHandler() {
    console.log("ADD TEAM", teamData);
    addTeam(teamData);
    navigation.goBack();
  }

  function modifyTeamHandler() {
    console.log("MODFIY TEAM NOW", teamData);
    modifyTeam(teamData, modifyTeamData.firebaseKey);
    // updateTeamData(teamData);
    navigation.goBack();
  }

  const handleButtonPress = () => {
    if (modifyTeamData !== undefined) {
      Alert.alert(
        "Confirm Changes",
        "Are you sure you want to modfy the team?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Modify",
            style: "destructive",
            onPress: modifyTeamHandler,
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Confirm Changes",
        "Are you sure you want to add the team?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            style: "destructive",
            onPress: addTeamHandler,
          },
        ],
        { cancelable: false }
      );
    }
  };

  function removePlayerHandler(index) {
    setTeamData((prevState) => {
      const updatedPlayers = [...prevState.players];
      updatedPlayers.splice(index, 1);
      return {
        ...prevState,
        players: updatedPlayers,
      };
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>TEAM:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("teamName", text)}
          value={teamData.teamName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>MANAGER:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("manager", text)}
          value={teamData.manager}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>GROUP:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("group", text)}
          value={teamData.group}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>NUMBER</Text>
        <Text style={styles.headerText}>PLAYER</Text>
      </View>
      {teamData.players.map((player, index) => (
        <View style={styles.playerRow} key={index}>
          <TextInput
            style={styles.playerInput}
            onChangeText={(text) =>
              inputChangedHandler(`player-${index}`, text)
            }
            value={player.number}
            placeholder="Number"
          />
          <TextInput
            style={styles.playerInput}
            onChangeText={(text) =>
              inputChangedHandler(`player-${index}`, text)
            }
            value={player.name}
            placeholder="Player"
          />
          <Pressable onPress={() => removePlayerHandler(index)}>
            <Text style={styles.removeText}>x</Text>
          </Pressable>
        </View>
      ))}
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          mode="flat"
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button style={styles.button} onPress={handleButtonPress}>
          {modifyTeamData !== undefined ? "Modify" : "Add"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  playerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: "row",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  removeText: {
    fontSize: 20,
    color: "red",
    marginLeft: 10, // Adjust the spacing as needed
  },
});

export default TeamsHandler;
