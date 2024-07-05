import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Background from "../components/Background.js";

function LeaguesScreen() {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.text}>NO LEAGUES FOR NOW</Text>
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
    color: "white",
    fontSize: 20, // Adjust the font size as needed
  },
});

export default LeaguesScreen;
