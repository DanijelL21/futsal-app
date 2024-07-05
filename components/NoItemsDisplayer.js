import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Background from "../components/Background.js";

function NoItems({ text }) {
  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
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
    fontSize: 20,
  },
});

export default NoItems;
