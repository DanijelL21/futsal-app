// External Libraries
import { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";

// Internal Modules
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import Background from "../components/Background";
import { BasicContext } from "../store/basic-context";
import { updateData, postData, deleteData } from "../util/https";
import { validateGameDataInput } from "../components/InputValidator";
import PrimaryButton from "../components/buttons/PrimaryButton";
import IoniconsButton from "../components/buttons/IoniconsButton";
import idGenerator from "../components/IdGenerator";
import TeamsListModal from "./components/TeamsListModal";

const TEXT_INPUT_SIZE = dimensions.screenWidth * 0.05; // INPUT SIZE

// this is calculated dinamically. DON'T TOUCH
const TEXT_INFO_SIZE = TEXT_INPUT_SIZE * 0.85; // TEAM, MANAGER,...
const BOXES_HEIGHT = TEXT_INPUT_SIZE * 2;
const BOXES_MARGIN = dimensions.screenWidth * 0.025;
const LEFT_INFO_MARGIN = TEXT_INFO_SIZE * 0.5882;

function GamesHandler({ navigation, route }) {
  const torunamentPhase = route.params.tournamentPhase;
  const modifyGame = route.params.modifyGameData;
  const [gameData, setGameData] = useState({
    id: modifyGame ? modifyGame.id : "",
    home: modifyGame ? modifyGame.home : "",
    away: modifyGame ? modifyGame.away : "",
    date: modifyGame ? modifyGame.date : "",
    time: modifyGame ? modifyGame.time : "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [teamType, setTeamType] = useState("home");

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  // set title
  useEffect(() => {
    if (modifyGame !== undefined) {
      navigation.setOptions({
        title: "Modify game",
      });
    }
  }, [modifyGame, navigation]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setGameData((curInputs) => ({
      ...curInputs,
      [inputIdentifier]: enteredValue,
    }));
  }

  async function generateNextId() {
    const nextId = await idGenerator(tournamentName, torunamentPhase);
    gameData.id = nextId;
  }

  const handleButtonPress = () => {
    const { isValid, message } = validateGameDataInput(gameData);

    if (!isValid) {
      Alert.alert("Validation Error", message);
      return;
    }
    if (modifyGame !== undefined) {
      console.log("MG", modifyGame);
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to modify game?`,
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
                gameData,
                `games/${torunamentPhase}`,
                modifyGame.firebaseKey
              );
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      generateNextId();
      Alert.alert(
        "Confirm Changes",
        `Are you sure you want to add game?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            style: "destructive",
            onPress: async () => {
              await postData(
                tournamentName,
                gameData,
                `games/${torunamentPhase}`
              );
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const openTeamModal = (type) => {
    setTeamType(type);
    setModalVisible(true);
  };

  return (
    <Background style={styles.container}>
      <TeamsListModal
        tournamentName={tournamentName}
        visible={modalVisible}
        setTeam={(identifier, team) => inputChangedHandler(identifier, team)}
        teamType={teamType}
        onClose={() => {
          setModalVisible(false);
        }}
      />
      <View
        style={[styles.inputContainer, { marginLeft: LEFT_INFO_MARGIN * 3.7 }]}
      >
        <Text style={styles.teamInfoText}>HOME TEAM:</Text>
        <PrimaryButton
          onPress={() => openTeamModal("home")}
          buttonText={gameData.home || "Select Home Team"}
          buttonStyle={styles.teamInput}
          buttonTextStyle={styles.inputText}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.teamInfoText}>AWAY TEAM:</Text>
        <PrimaryButton
          onPress={() => openTeamModal("away")}
          buttonText={gameData.away || "Select Away Team"}
          buttonStyle={styles.teamInput}
          buttonTextStyle={styles.inputText}
        />
      </View>
      <View
        style={[styles.inputContainer, { marginLeft: LEFT_INFO_MARGIN * 2.5 }]}
      >
        <Text style={styles.teamInfoText}>DATE:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("date", text)}
          value={gameData.date}
          placeholder="DD.MM.YYYY"
          placeholderTextColor="#FFFFFF80"
        />
      </View>
      <View
        style={[styles.inputContainer, { marginLeft: LEFT_INFO_MARGIN * 2.5 }]}
      >
        <Text style={styles.teamInfoText}>TIME:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => inputChangedHandler("time", text)}
          value={gameData.time}
          placeholder="HH:MM"
          placeholderTextColor="#FFFFFF80"
        />
      </View>
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
          buttonText={"Add"}
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
      {modifyGame && (
        <View style={styles.deleteContainer}>
          <IoniconsButton
            icon="trash"
            size={36}
            color={colors.redNoticeColor}
            onPress={() =>
              Alert.alert(
                "Confirm Changes",
                `Are you sure you want to delete team?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Add",
                    style: "destructive",
                    onPress: async () => {
                      await deleteData(
                        tournamentName,
                        `games/${torunamentPhase}/`,
                        modifyGame.firebaseKey
                      );
                      navigation.goBack();
                    },
                  },
                ],
                { cancelable: false }
              )
            }
          />
        </View>
      )}
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
  teamInput: {
    flex: 1,
    height: BOXES_HEIGHT,
    borderWidth: 1,
    borderColor: colors.headerTextColor,
    marginLeft: LEFT_INFO_MARGIN,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: colors.headerTextColor,
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
  deleteContainer: {
    alignContent: "center",
    alignItems: "center",
    marginTop: dimensions.screenWidth * 0.025,
    marginBottom: dimensions.screenWidth * 0.1,
  },
});

export default GamesHandler;
