// External Libraries
import { Text, StyleSheet, View } from "react-native";

// Internal Modules
import Background from "../components/Background.js";
import NoItemsDisplayer from "../components/NoItemsDisplayer.js";
import colors from "../constants/colors.js";

function LeaguesScreen() {
  const leagues = [];

  if (leagues.length === 0) {
    return <NoItemsDisplayer text={"NO LEAGUES FOR NOW"} />;
  }

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.text}> TODO </Text>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.headerTextColor,
    fontSize: 20,
  },
});

export default LeaguesScreen;
