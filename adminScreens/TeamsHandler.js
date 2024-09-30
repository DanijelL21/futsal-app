// External Libraries
import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Internal Modules
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import Background from "../components/Background";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import { BasicContext } from "../store/basic-context";
import { validateTeamDataInput } from "../components/InputValidator";
import { updateData, postData, getData } from "../util/https";
import idGenerator from "../components/IdGenerator";
const DEFAULT_NR_OF_PLAYERS = 12;
const MAX_TEXT_LENGTH = 25;
const TEXT_INPUT_SIZE = dimensions.screenWidth * 0.05;

// this is calculated dinamically. DON'T TOUCH
const TEXT_INFO_SIZE = TEXT_INPUT_SIZE * 0.85;
const BOXES_HEIGHT = TEXT_INPUT_SIZE * 2;
const BOXES_MARGIN = dimensions.screenWidth * 0.025;
const LEFT_INFO_MARGIN = TEXT_INFO_SIZE * 0.5882;

function TeamsHandler({ navigation, route }) {
  const modifyTeamData = route.params?.modifyTeamData;
  const [teamData, setTeamData] = useState({
    id: modifyTeamData ? modifyTeamData.id : "",
    teamName: modifyTeamData ? modifyTeamData.teamName : "",
    manager: modifyTeamData ? modifyTeamData.manager : "",
    group: modifyTeamData ? modifyTeamData.group : "TBD",
    players: modifyTeamData
      ? modifyTeamData.players.map((player) => ({
          ...player,
          number: player.number.toString(),
          club: modifyTeamData.club || "",
          stats: {
            goals: player?.stats?.goals || 0,
            assists: player?.stats?.assists || 0,
            rc: player?.stats?.rc || 0,
            yc: player?.stats?.yc || 0,
          },
        }))
      : Array.from({ length: DEFAULT_NR_OF_PLAYERS }, (_, index) => ({
          number: (index + 1).toString(),
          name: "",
          club: "",
          stats: {
            goals: 0,
            assists: 0,
            rc: 0,
            yc: 0,
          },
        })),
    statistics: modifyTeamData
      ? modifyTeamData.statistics
      : {
          pg: 0,
          w: 0,
          l: 0,
          d: 0,
          g: [0, 0],
          gd: 0,
          p: 0,
        },
  });

  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;

  // set title
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
      } else if (inputIdentifier.startsWith("playerNumber")) {
        const index = parseInt(inputIdentifier.split("-")[1]);
        const updatedPlayers = [...curInputs.players];
        updatedPlayers[index].number = enteredValue;
        return {
          ...curInputs,
          players: updatedPlayers,
        };
      } else if (inputIdentifier.startsWith("playerName")) {
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

  const handleButtonPress = async () => {
    const { isValid, message } = validateTeamDataInput(teamData);

    if (!isValid) {
      Alert.alert("Validation Error", message);
      return;
    }

    // Filter out players without names
    const filteredPlayers = teamData.players.filter(
      (player) => player.name.trim() !== ""
    );

    // Add teamName as club for every player
    const updatedPlayers = filteredPlayers.map((player) => ({
      ...player,
      club: teamData.teamName, // Adding teamName as club
    }));

    const updatedTeamData = {
      ...teamData,
      players: updatedPlayers,
    };

    async function handleModify() {
      await updateData(
        competitionName,
        updatedTeamData,
        `teams/${modifyTeamData.firebaseKey}`
      );

      // if name changed, we need to update in games also
      if (modifyTeamData.teamName != updatedTeamData.teamName) {
        const games = await getData(competitionName, "games");

        let jsonString = JSON.stringify(games);

        const updatedJsonString = jsonString.replaceAll(
          modifyTeamData.teamName,
          updatedTeamData.teamName
        );

        console.log("CHECK", jsonString !== updatedJsonString);
        const changesMade = jsonString !== updatedJsonString;

        // If changes were made, update games
        if (changesMade) {
          const updatedJson = JSON.parse(updatedJsonString);
          await updateData(competitionName, updatedJson, "games");
        }
      }
      navigation.goBack();
    }

    if (modifyTeamData !== undefined) {
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to modify the team?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Modify",
            style: "destructive",
            onPress: handleModify,
          },
        ],
        { cancelable: false }
      );
    } else {
      const nextId = await idGenerator(competitionName);
      newTeamData = {
        ...updatedTeamData,
        id: nextId,
      };
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to add the team?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            style: "destructive",
            onPress: async () => {
              await postData(competitionName, newTeamData, "teams"); // Use filtered players here
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const addPlayerHandler = () => {
    setTeamData((prevState) => {
      const newPlayerNumber = (prevState.players.length + 1).toString();
      const newPlayer = {
        number: newPlayerNumber,
        name: "",
        stats: {
          goals: 0,
          assists: 0,
          rc: 0,
          yc: 0,
        },
      };
      return {
        ...prevState,
        players: [...prevState.players, newPlayer],
      };
    });
  };

  function addPlayerButton() {
    return (
      <SecondaryButton onPress={addPlayerHandler}>
        <View style={styles.addPlayer}>
          <Ionicons
            name="add-outline"
            color={colors.headerTextColor}
            size={TEXT_INPUT_SIZE}
          />
        </View>
      </SecondaryButton>
    );
  }

  return (
    <Background style={styles.container}>
      <View
        style={[styles.inputContainer, { marginLeft: LEFT_INFO_MARGIN * 3.7 }]}
      >
        <Text style={styles.teamInfoText}>TEAM:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("teamName", text)}
          value={teamData.teamName}
          placeholder="Team name"
          placeholderTextColor="#FFFFFF80"
          maxLength={MAX_TEXT_LENGTH}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.teamInfoText}>MANAGER:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("manager", text)}
          value={teamData.manager}
          placeholder="Manager"
          placeholderTextColor="#FFFFFF80"
          maxLength={MAX_TEXT_LENGTH}
        />
      </View>
      {competitionInfo.mode === "tournaments" && (
        <View
          style={[
            styles.inputContainer,
            { marginLeft: LEFT_INFO_MARGIN * 2.5 },
          ]}
        >
          <Text style={styles.teamInfoText}>GROUP:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => inputChangedHandler("group", text)}
            value={teamData.group}
            maxLength={3}
            autoCapitalize="characters"
          />
        </View>
      )}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>PLAYER</Text>
      </View>
      <FlatList
        data={teamData.players}
        renderItem={({ item: player, index }) => (
          <View style={styles.playerRow} key={index}>
            <TextInput
              style={styles.numberInput}
              onChangeText={(text) =>
                inputChangedHandler(`playerNumber-${index}`, text)
              }
              value={player.number}
              placeholder="Number"
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={styles.playerInput}
              onChangeText={(text) =>
                inputChangedHandler(`playerName-${index}`, text)
              }
              value={player.name}
              placeholder="Player"
              placeholderTextColor="#FFFFFF80"
              autoCapitalize="words"
              maxLength={MAX_TEXT_LENGTH}
            />
            <PrimaryButton
              onPress={() =>
                Alert.alert(
                  "Confirm Changes",
                  `Are you sure you want to delete player? \n \n All stastics for this player will be lost`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => removePlayerHandler(index),
                    },
                  ],
                  { cancelable: false }
                )
              }
              buttonText={"x"}
              buttonTextStyle={styles.removeText}
            />
          </View>
        )}
        keyExtractor={(item, index) => `player-${index}`}
        ListFooterComponent={addPlayerButton}
        scrollIndicatorInsets={{ right: 1 }}
      />

      <View style={styles.finalButtonsContainer}>
        <PrimaryButton
          onPress={() => navigation.goBack()}
          buttonText={"Cancel"}
          buttonStyle={styles.finalButton}
          buttonTextStyle={[
            styles.finalButtonText,
            { color: colors.cancelButtonColor },
          ]}
        />
        <PrimaryButton
          onPress={handleButtonPress}
          buttonText={modifyTeamData !== undefined ? "Modify" : "Add"}
          buttonStyle={[
            styles.finalButton,
            {
              backgroundColor: colors.confirmButtonColor,
              borderRadius: 4,
              padding: 8,
            },
          ]}
          buttonTextStyle={[styles.finalButtonText]}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: dimensions.screenWidth * 0.05,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: BOXES_MARGIN,
  },
  teamInfoText: {
    fontSize: TEXT_INFO_SIZE,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  input: {
    flex: 1,
    height: BOXES_HEIGHT,
    borderWidth: 1,
    borderColor: colors.headerTextColor,
    color: colors.headerTextColor,
    marginLeft: LEFT_INFO_MARGIN,
    textAlign: "center",
    fontSize: TEXT_INPUT_SIZE,
  },
  headerContainer: {
    justifyContent: "center",
    marginBottom: dimensions.screenWidth * 0.05,
    marginTop: dimensions.screenWidth * 0.05,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: TEXT_INFO_SIZE,
    color: colors.headerTextColor,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: BOXES_MARGIN,
    height: BOXES_HEIGHT,
  },
  numberInput: {
    width: BOXES_HEIGHT * 1.25,
    borderWidth: 1,
    fontSize: TEXT_INPUT_SIZE,
    borderColor: colors.headerTextColor,
    color: colors.headerTextColor,
    textAlign: "center",
  },
  playerInput: {
    flex: 1,
    borderWidth: 1,
    fontSize: TEXT_INPUT_SIZE,
    borderColor: colors.headerTextColor,
    color: colors.headerTextColor,
    textAlign: "center",
  },
  finalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: dimensions.screenWidth * 0.075,
    marginTop: dimensions.screenWidth * 0.025,
  },
  finalButton: {
    minWidth: dimensions.screenWidth * 0.3,
    height: dimensions.screenWidth * 0.08,
    marginHorizontal: dimensions.screenWidth * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    fontSize: TEXT_INPUT_SIZE * 1.5,
    color: colors.redNoticeColor,
    marginLeft: dimensions.screenWidth * 0.0375,
  },
  addPlayer: {
    marginTop: dimensions.screenWidth * 0.05,
    marginBottom: dimensions.screenWidth * 0.05,
    alignItems: "center",
  },
  finalButtonText: {
    color: colors.headerTextColor,
    textAlign: "center",
    fontSize: dimensions.screenWidth * 0.035,
  },
});

export default TeamsHandler;
