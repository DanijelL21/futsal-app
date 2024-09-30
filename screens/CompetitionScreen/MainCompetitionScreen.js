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
const COMPETITION_BUTTONS_SIZE = dimensions.screenWidth * 0.3;
const COMPETITION_FONT_SIZE = dimensions.screenWidth * 0.05;

function MainCompetitionScreen({ navigation, route }) {
  const [liveMatchData, setliveMatchData] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;

  const isAdmin = authCtx.isAuthenticated(competitionName);

  useEffect(() => {
    navigation.setOptions({
      title: competitionName,
      headerRight: getHeaderRight,
    });
  }, [competitionName, navigation, isAdmin]);

  useEffect(() => {
    async function getLiveMatchData() {
      const data = await getData(competitionName, "live");
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
      competitionPhase: liveMatchData.competitionPhase,
    });
  }

  const getHeaderRight = () => {
    return authCtx.isAuthenticated(competitionName) ? (
      <LogOutScreen />
    ) : (
      <LoginScreen />
    );
  };

  return (
    <Background>
      <View style={styles.competitionPictureContainer}>
        <Image
          source={{ uri: competitionInfo.imageUri }}
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
                buttonStyle={styles.competitionButton}
                buttonTextStyle={styles.competitionButtonText}
              />
              <PrimaryButton
                onPress={buttonHandler("Games")}
                buttonText={"Games"}
                buttonStyle={styles.competitionButton}
                buttonTextStyle={styles.competitionButtonText}
              />
            </View>
            <View style={styles.column}>
              <PrimaryButton
                onPress={buttonHandler("Statistics")}
                buttonText={"Statistics"}
                buttonStyle={styles.competitionButton}
                buttonTextStyle={styles.competitionButtonText}
              />
              <PrimaryButton
                onPress={buttonHandler("Teams")}
                buttonText={"Teams"}
                buttonStyle={styles.competitionButton}
                buttonTextStyle={styles.competitionButtonText}
              />
            </View>
          </View>
        </>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  competitionPictureContainer: {
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
  competitionButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.headerTextColor,
    borderRadius: COMPETITION_BUTTONS_SIZE / 2,
    width: COMPETITION_BUTTONS_SIZE,
    height: COMPETITION_BUTTONS_SIZE,
    marginBottom: dimensions.screenWidth * 0.125,
    alignItems: "center",
    justifyContent: "center",
  },
  competitionButtonText: {
    color: colors.headerTextColor,
    fontSize: COMPETITION_FONT_SIZE,
    fontWeight: "bold",
  },
});

export default MainCompetitionScreen;
