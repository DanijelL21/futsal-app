// External Libraries
import { Text, StyleSheet, View } from "react-native";

// Internal Modules
import Background from "../components/Background.js";
import dimensions from "../constants/dimensions.js";
import colors from "../constants/colors.js";

function NoItemsDisplayer({ text, includeBackground = true }) {
  const content = (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );

  return includeBackground ? <Background>{content}</Background> : content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.05,
  },
});

export default NoItemsDisplayer;
