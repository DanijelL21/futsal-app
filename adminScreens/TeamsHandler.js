import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Background from "../components/Background";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import dimensions from "../constants/dimensions";
import { BasicContext } from "../store/basic-context";
import { validateTeamDataInput } from "../components/InputValidator";
import { updateData, postData } from "../util/https";
const DEFAULT_NR_OF_PLAYERS = 13;
const MAX_TEXT_LENGTH = 30;
const TEXT_INPUT_SIZE = dimensions.screenWidth * 0.05;

// this is calculated dinamically. DON'T TOUCH
const TEXT_INFO_SIZE = TEXT_INPUT_SIZE * 0.85;
const BOXES_HEIGHT = TEXT_INPUT_SIZE * 2;
const BOXES_MARGIN = dimensions.screenWidth * 0.025;
const LEFT_INFO_MARGIN = TEXT_INFO_SIZE * 0.5882;

function TeamsHandler({ navigation, route }) {
  const nrOfTeams = route.params.nrOfTeams;
  const modifyTeamData = route.params.modifyTeamData;
  const [teamData, setTeamData] = useState({
    id: modifyTeamData ? modifyTeamData.id : nrOfTeams + 2,
    teamName: modifyTeamData ? modifyTeamData.teamName : "",
    manager: modifyTeamData ? modifyTeamData.manager : "",
    group: modifyTeamData ? modifyTeamData.group : "TBD",
    players: modifyTeamData
      ? modifyTeamData.players.map((player) => ({
          ...player,
          number: player.number.toString(),
        }))
      : Array.from({ length: DEFAULT_NR_OF_PLAYERS }, (_, index) => ({
          number: (index + 1).toString(),
          name: "",
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
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

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

  const handleButtonPress = () => {
    const { isValid, message } = validateTeamDataInput(teamData);

    if (!isValid) {
      Alert.alert("Validation Error", message);
      return;
    }
    if (modifyTeamData !== undefined) {
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to modify team?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Modify",
            style: "destructive",
            onPress: async () => {
              await updateData(
                tournamentName,
                teamData,
                "teams",
                modifyTeamData.firebaseKey
              );
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to add team?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            style: "destructive",
            onPress: async () => {
              await postData(tournamentName, teamData, "teams");
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
      const newPlayer = { number: newPlayerNumber, name: "" };
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
          maxLength={MAX_TEXT_LENGTH}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.teamInfoText}>MANAGER:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("manager", text)}
          value={teamData.manager}
          maxLength={MAX_TEXT_LENGTH}
        />
      </View>
      <View
        style={[styles.inputContainer, { marginLeft: LEFT_INFO_MARGIN * 2.5 }]}
      >
        <Text style={styles.teamInfoText}>GROUP:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("group", text)}
          value={teamData.group}
          maxLength={teamData.group !== "TBD" ? 1 : 3}
        />
      </View>
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
              autoCapitalize="words"
              maxLength={MAX_TEXT_LENGTH}
            />
            <PrimaryButton
              onPress={() => removePlayerHandler(index)}
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
