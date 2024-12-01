import { StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react";
import Markdown from "react-native-markdown-display";
// Internal Modules
import Background from "../components/Background";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";

const IMAGE_HEIGHT = dimensions.screenWidth * 0.6;

function SingleNewsScreen({ navigation, route }) {
  const newsData = route.params.newsData;

  useEffect(() => {
    navigation.setOptions({
      title: newsData.title,
    });
  }, [newsData, navigation]);

  return (
    <Background>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Markdown style={styles.markdown}>{newsData.content}</Markdown>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  markdown: {
    text: {
      color: colors.headerTextColor,
      fontSize: 20,
    },
    link: {
      color: "#1e90ff",
    },
    image: {
      width: "100%",
      height: IMAGE_HEIGHT,
      alignSelf: "center",
    },
  },
});

export default SingleNewsScreen;
