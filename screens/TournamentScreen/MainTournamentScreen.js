// External Libraries
import { useEffect, useContext, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

// Internal Modules
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import Background from "../../components/Background";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";
import { AuthContext } from "../../store/auth-context";
import { getData } from "../../util/https";
import { BasicContext } from "../../store/basic-context";
import LoginScreen from "../../components/Login";
import LogOutScreen from "../../components/Logout";
import LoadinSpinner from "../../components/LoadingSpinner";

const IMAGE_HEIGHT = dimensions.screenWidth * 0.6;
const IMAGE_WIDTH = dimensions.screenWidth * 0.8;
const START_GAME_PADDING = dimensions.screenWidth * 0.1;
const START_GAME_FONT_SIZE = dimensions.screenWidth * 0.075;
const TOURNAMENT_BUTTONS_SIZE = dimensions.screenWidth * 0.3;
const TOURNAMENT_FONT_SIZE = dimensions.screenWidth * 0.05;

function MainTournamentScreen({ navigation, route }) {
  const [liveMatchData, setliveMatchData] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  const isAdmin = authCtx.isAuthenticated(tournamentName);

  useEffect(() => {
    navigation.setOptions({
      title: tournamentName,
      headerRight: getHeaderRight,
    });
  }, [tournamentName, navigation, isAdmin]);

  useEffect(() => {
    async function getLiveMatchData() {
      const data = await getData(tournamentName, "live");
      if (data !== null) {
        const liveMatch = Object.values(data)[0];
        setliveMatchData(liveMatch);
      }
    }
    getLiveMatchData();
  }, [navigation]);

  function buttonHandler(name) {
    return () => {
      navigation.navigate(name);
    };
  }

  function liveMatchPressed() {
    navigation.navigate("MatchScreen", {
      firebaseKey: liveMatchData.firebaseKey,
      tournamentPhase: liveMatchData.tournamentPhase,
    });
  }

  const getHeaderRight = () => {
    return authCtx.isAuthenticated(tournamentName) ? (
      <LogOutScreen />
    ) : (
      <LoginScreen />
    );
  };

  return (
    <Background>
      <View style={styles.tournamentPictureContainer}>
        <Image
          source={{ uri: tournamentInfo.imageUri }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => setLoadingImages(false)}
        />
      </View>
      {loadingImages ? (
        <LoadinSpinner />
      ) : (
        <>
          {isAdmin ? (
            <View style={styles.startGameContainer}>
              <PrimaryButton
                onPress={() => navigation.navigate("StartGame")}
                buttonText={"Start Game"}
                buttonStyle={styles.startGameButton}
                buttonTextStyle={styles.startGame}
              />
            </View>
          ) : (
            Object.keys(liveMatchData).length !== 0 && (
              <SecondaryButton onPress={liveMatchPressed}>
                <View style={styles.startGameContainer}>
                  <Text
                    style={[
                      styles.liveGameText,
                      { fontSize: START_GAME_FONT_SIZE },
                    ]}
                  >
                    LIVE NOW :
                  </Text>
                  <Text style={styles.liveGameText}>
                    {liveMatchData.home} VS {liveMatchData.away}
                  </Text>
                </View>
              </SecondaryButton>
            )
          )}
          <View
            style={[
              styles.buttonsContainer,
              {
                marginTop:
                  isAdmin || Object.keys(liveMatchData).length !== 0
                    ? 50
                    : dimensions.screenWidth * 0.25,
              },
            ]}
          >
            <View style={styles.column}>
              <PrimaryButton
                onPress={buttonHandler("Tables")}
                buttonText={"Tables"}
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
                onPress={buttonHandler("Statistics")}
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
        </>
      )}
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
  liveGameText: {
    color: colors.redNoticeColor,
    fontSize: dimensions.screenWidth * 0.05,
    fontWeight: "bold",
    paddingBottom: 5,
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
