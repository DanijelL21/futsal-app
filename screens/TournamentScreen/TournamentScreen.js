import { Text, View, StyleSheet, SafeAreaView, Image } from "react-native";
import { useEffect } from "react";
import TournamentButton from "./components/TournamentButton";
import PrimaryButton from "../../components/Button";

function TournamentScreen({ navigation, route }) {
  const tournamentName = route.params.tournamentName; // getting data from previous screen
  const tournamentPicture = route.params.tournamentPicture;
  const isAdmin = true;

  useEffect(() => {
    // set screen title
    navigation.setOptions({
      title: tournamentName,
    });
  }, [tournamentName, navigation]);

  function buttonHandler(name) {
    return () => {
      navigation.navigate(name, {
        tournamentName: name,
        isAdmin: isAdmin,
      });
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tournamentPictureContainer}>
        <Image
          source={{ uri: tournamentPicture }}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.tournamentDataContainer}>
        <Text style={styles.tournamentNameContainer}>{tournamentName}</Text>
      </View>
      {isAdmin && (
        <View style={{ flex: 1 }}>
          <PrimaryButton
            onPress={() => navigation.navigate("StartGame")}
            buttonText={"Start Game"}
            buttonColor={"#090909"}
          />
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <View style={styles.column}>
          <TournamentButton
            onPress={buttonHandler("table")}
            buttonText={"Table"}
            buttonColor={"#d5ebde"}
          />
          <TournamentButton
            onPress={buttonHandler("Games")}
            buttonText={"Games"}
            buttonColor={"#d5ebde"}
          />
        </View>
        <View style={styles.column}>
          <TournamentButton
            onPress={() => console.log("Button 2 pressed")}
            buttonText={"Statistics"}
            buttonColor={"#d5ebde"}
          />
          <TournamentButton
            onPress={buttonHandler("Teams")}
            buttonText={"Teams"}
            buttonColor={"#d5ebde"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tournamentPictureContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  tournamentDataContainer: {
    alignItems: "center",
    paddingTop: 20, // Adjusted paddingTop for better spacing
  },
  tournamentNameContainer: {
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Changed to distribute space evenly
    alignItems: "center",
  },
  column: {
    alignItems: "center",
  },
});

export default TournamentScreen;
