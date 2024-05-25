import { View, StyleSheet, Image, Text } from "react-native";
import { useEffect, useContext } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import Background from "../../components/Background";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";
import { AuthContext } from "../../store/auth-context";
import { BasicContext } from "../../store/basic-context";

import LoginScreen from "../../components/Login";
import LogOutScreen from "../../components/Logout";
const IMAGE_HEIGHT = dimensions.screenWidth * 0.6;
const IMAGE_WIDTH = dimensions.screenWidth * 0.8;
const START_GAME_PADDING = dimensions.screenWidth * 0.1;
const START_GAME_FONT_SIZE = dimensions.screenWidth * 0.075;
const TOURNAMENT_BUTTONS_SIZE = dimensions.screenWidth * 0.3;
const TOURNAMENT_FONT_SIZE = dimensions.screenWidth * 0.05;

function MainTournamentScreen({ navigation, route }) {
  const tournamentName = route.params.tournamentName;
  const tournamentPicture = route.params.tournamentPicture;

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);

  const getHeaderRight = () => {
    return authCtx.isAuthenticated ? (
      <LogOutScreen></LogOutScreen>
    ) : (
      <LoginScreen />
    );
  };
  // set screen title and tournament name
  useEffect(() => {
    navigation.setOptions({
      title: tournamentName,
      headerRight: getHeaderRight,
    });
    basicCtx.setTournamentName(tournamentName);
  }, [tournamentName, navigation, authCtx.isAuthenticated]);

  function buttonHandler(name) {
    return () => {
      navigation.navigate(name);
    };
  }

  return (
    <Background>
      <View style={styles.tournamentPictureContainer}>
        <Image
          source={{ uri: tournamentPicture }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      {isAdmin && (
        <View style={styles.startGameContainer}>
          <PrimaryButton
            onPress={() => navigation.navigate("StartGame")}
            buttonText={"Start Game"}
            buttonStyle={styles.startGameButton}
            buttonTextStyle={styles.startGame}
          />
        </View>
      )}
      <View
        style={[
          styles.buttonsContainer,
          { marginTop: isAdmin ? 50 : dimensions.screenWidth * 0.25 },
        ]}
      >
        <View style={styles.column}>
          <PrimaryButton
            onPress={buttonHandler("table")}
            buttonText={"Table"}
            buttonStyle={styles.tournamentButton}
            buttonTextStyle={styles.tournamentButtonText}
          />
          <PrimaryButton
            onPress={buttonHandler("Games")}
            buttonText={"Games"}
            buttonStyle={styles.tournamentButton}
            buttonTextStyle={styles.tournamentButtonText}
          />
        </View>
        <View style={styles.column}>
          <PrimaryButton
            onPress={buttonHandler("Games")}
            buttonText={"Statistics"}
            buttonStyle={styles.tournamentButton}
            buttonTextStyle={styles.tournamentButtonText}
          />
          <PrimaryButton
            onPress={buttonHandler("Teams")}
            buttonText={"Teams"}
            buttonStyle={styles.tournamentButton}
            buttonTextStyle={styles.tournamentButtonText}
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  tournamentPictureContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: dimensions.screenWidth * 0.05,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
  },
  startGameContainer: {
    alignItems: "center",
    marginTop: dimensions.screenWidth * 0.09,
  },
  startGameButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.redNoticeColor,
    paddingHorizontal: START_GAME_PADDING,
    paddingVertical: START_GAME_PADDING / 4,
  },
  startGame: {
    color: colors.redNoticeColor,
    fontSize: START_GAME_FONT_SIZE,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  column: {
    alignItems: "center",
  },
  tournamentButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.headerTextColor,
    borderRadius: TOURNAMENT_BUTTONS_SIZE / 2,
    width: TOURNAMENT_BUTTONS_SIZE,
    height: TOURNAMENT_BUTTONS_SIZE,
    marginBottom: dimensions.screenWidth * 0.125,
    alignItems: "center",
    justifyContent: "center",
  },
  tournamentButtonText: {
    color: colors.headerTextColor,
    fontSize: TOURNAMENT_FONT_SIZE,
    fontWeight: "bold",
  },
});

export default MainTournamentScreen;
