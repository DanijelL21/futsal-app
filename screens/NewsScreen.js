import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Background from "../components/Background.js";
import NoItemsDisplayer from "../components/NoItemsDisplayer.js";
import colors from "../constants/colors.js";
function NewsScreen() {
  const news = [];

  if (news.length === 0) {
    return <NoItemsDisplayer text={"NO NEWS FOR NOW"} />;
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

export default NewsScreen;
