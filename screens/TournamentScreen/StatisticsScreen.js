import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Background from "../../components/Background";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";
import colors from "../../constants/colors";
function StatisticsScreen() {
  const statistics = [];

  if (statistics.length === 0) {
    return <NoItemsDisplayer text={"NO STATISTICS FOR NOW"} />;
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

export default StatisticsScreen;
