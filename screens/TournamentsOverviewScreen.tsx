import { StyleSheet, Text, View, Animated, Pressable } from "react-native";
import type { PagerViewOnPageScrollEventData } from "react-native-pager-view";
import { useRef, useEffect, useState, useContext } from "react";
import PagerView from "react-native-pager-view";
import data from "../dummy/dummy_data";
import Background from "../components/Background";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import PrimaryButton from "../components/PrimaryButton";
import { getTournaments } from "../util/https";
import { BasicContext } from "../store/basic-context";

const DOT_SIZE = dimensions.screenWidth * 0.15;
const TITLE_SIZE = dimensions.screenWidth * 0.075;
const IMAGE_SIZE = dimensions.screenWidth * 0.6;
const DATE_SIZE = dimensions.screenWidth * 0.065;

const Title = ({ data, scrollOffsetAnimatedValue, positionAnimatedValue }) => {
  const inputRange = [0, data.length];
  const translateY = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * -TITLE_SIZE],
  });
  return (
    <View style={styles.titleContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map(({ name }, index) => {
          return (
            <Text key={index} style={styles.titleText}>
              {name}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({
  name,
  imageUri,
  date,
  scrollOffsetAnimatedValue,
  navigation,
}) => {
  const inputRange = [0, 0.5, 0.99];
  const inputRangeOpacity = [0, 0.5, 0.99];
  const scale = scrollOffsetAnimatedValue.interpolate({
    inputRange,
    outputRange: [1, 0, 1],
  });

  const opacity = scrollOffsetAnimatedValue.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [1, 0, 1],
  });

  const handleImagePress = () => {
    navigation.navigate("TournamentScreen", {
      tournamentName: name,
      tournamentPicture: imageUri,
    });
  };
  console.log("DATE", date);
  console.log("NAME", name);
  console.log("IMAGEURI", imageUri);
  return (
    <View style={styles.itemStyle}>
      <Pressable onPress={handleImagePress}>
        {({ pressed }) => (
          <Animated.Image
            source={{
              uri: imageUri,
            }}
            style={[
              styles.image,
              {
                transform: [{ scale }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          />
        )}
      </Pressable>
      <View style={styles.dateContainer}>
        <Animated.Text
          style={[
            styles.date,
            {
              opacity,
            },
          ]}
        >
          {date}
        </Animated.Text>
      </View>
    </View>
  );
};

const Pagination = ({
  data,
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}) => {
  const inputRange = [0, data.length];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * DOT_SIZE],
  });

  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: "absolute",
            transform: [{ translateX: translateX }],
          },
        ]}
      />
      {data.map((item) => {
        return (
          <View key={item.id} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function TournamentsOverviewScreen({ navigation, route }) {
  // const [data, setData] = useState([]);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;

  // get data

  // useEffect(() => {
  //   async function fetchTournaments() {
  //     const tournamentsData = await getTournaments();
  //     setData(tournamentsData);
  //   }
  //   fetchTournaments();
  // }, [navigation]);

  return (
    <Background>
      <Title
        data={data}
        scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
        positionAnimatedValue={positionAnimatedValue}
      />
      <AnimatedPagerView
        initialPage={0}
        style={{ width: "100%", height: "100%" }}
        onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
          [
            {
              nativeEvent: {
                offset: scrollOffsetAnimatedValue,
                position: positionAnimatedValue,
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
      >
        {data.map((item) => (
          <View collapsable={false} key={item.id}>
            <Item
              {...item}
              scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
              positionAnimatedValue={positionAnimatedValue}
              navigation={navigation}
            />
          </View>
        ))}
      </AnimatedPagerView>

      {/* THIS ARE LITTLE CIRCLES WHICH DINAMICALLY CHANGES */}
      <Pagination
        data={data}
        scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
        positionAnimatedValue={positionAnimatedValue}
      />
      <View style={styles.textContainer}>
        <PrimaryButton
          onPress={() => {}}
          buttonText={
            "To create tournament, please contact leonimail100@gmail.com"
          }
          buttonTextStyle={styles.text}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  dateContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  date: {
    color: colors.headerTextColor,
    fontSize: DATE_SIZE,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 5,
  },
  pagination: {
    position: "absolute",
    right: dimensions.screenWidth * 0.05,
    bottom: 150,
    flexDirection: "row",
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.headerTextColor,
  },
  titleContainer: {
    alignItems: "center",
    alignContent: "center",
    top: 100, // move title up or down
    overflow: "hidden",
    height: TITLE_SIZE,
  },
  titleText: {
    fontSize: TITLE_SIZE,
    lineHeight: TITLE_SIZE,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  textContainer: {
    bottom: 100,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});
