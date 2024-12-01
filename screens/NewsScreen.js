import { Text, StyleSheet, View, FlatList, Image } from "react-native";
import { useEffect, useState } from "react";
// Internal Modules
import Background from "../components/Background.js";
import NoItemsDisplayer from "../components/NoItemsDisplayer.js";
import colors from "../constants/colors.js";
import SecondaryButton from "../components/buttons/SecondaryButton.js";
import { getNews } from "../util/https.js";
import dimensions from "../constants/dimensions.js";

function NewsScreen({ navigation, route }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function getNewsData() {
      const data = await getNews();
      if (data !== null) {
        const newsData = Object.values(data);
        // Preload all images
        await Promise.all(newsData.map((item) => Image.prefetch(item.image)));
        setNews(newsData);
      }
    }
    getNewsData();
  }, [navigation]);

  function renderNews({ item }) {
    return (
      <SecondaryButton
        onPress={() =>
          navigation.navigate("SingleNews", {
            newsData: item,
          })
        }
        buttonStyle={styles.newsItem}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.newsImage} />
          <Text style={[styles.newsText, { color: item.titleColor }]}>
            {item.title}
          </Text>
        </View>
      </SecondaryButton>
    );
  }

  if (news.length === 0) {
    return <NoItemsDisplayer text={"NO NEWS FOR NOW"} />;
  }

  return (
    <Background>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNews}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  newsItem: {
    borderColor: colors.headerTextColor,
    borderWidth: 2,
    margin: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  newsImage: {
    width: "100%",
    height: dimensions.screenWidth * 0.508,
    borderRadius: 15,
    opacity: 0.5,
  },
  newsText: {
    position: "absolute",
    bottom: dimensions.screenWidth * 0.178,
    left: dimensions.screenWidth * 0.0764,
    fontSize: dimensions.screenWidth * 0.089,
    fontWeight: "bold",
    padding: 5,
  },
});

export default NewsScreen;
