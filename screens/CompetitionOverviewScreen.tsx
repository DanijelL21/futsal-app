// External Libraries
import { StyleSheet, Text, View, Animated, Pressable } from "react-native";
import type { PagerViewOnPageScrollEventData } from "react-native-pager-view";
import { useRef, useEffect, useState, useContext } from "react";
import PagerView from "react-native-pager-view";

// Internal Modules
import Background from "../components/Background";
import colors from "../constants/colors";
import dimensions from "../constants/dimensions";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { getCompetition } from "../util/https";
import LoadinSpinner from "../components/LoadingSpinner";
import NoItemsDisplayer from "../components/NoItemsDisplayer";
import { BasicContext } from "../store/basic-context";

const DOT_SIZE = dimensions.screenWidth * 0.15;
const TITLE_SIZE = dimensions.screenWidth * 0.075;
const IMAGE_SIZE = dimensions.screenWidth * 0.6;
const DATE_SIZE = dimensions.screenWidth * 0.05;

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
        {data.map(({ competitionName }, index) => {
          return (
            <Text key={index} style={styles.titleText}>
              {competitionName}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({
  item,
  scrollOffsetAnimatedValue,
  navigation,
  setLoadingImages,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const basicCtx = useContext(BasicContext);

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
    basicCtx.setCompetitionData(item);
    navigation.navigate("CompetitionScreen");
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadingImages(false);
  };
  return (
    <View style={styles.itemStyle}>
      <Pressable onPress={handleImagePress}>
        {({ pressed }) => (
          <>
            <Animated.Image
              source={{ uri: item.imageUri }}
              style={[
                styles.image,
                {
                  transform: [{ scale }],
                  opacity: isLoading ? 0 : pressed ? 0.8 : 1,
                },
              ]}
              onLoad={handleImageLoad}
            />
          </>
        )}
      </Pressable>
      {!isLoading && (
        <Animated.View style={[styles.dateContainer, { opacity }]}>
          <Animated.Text style={styles.date}>
            {item.startDate} to {item.endDate}
          </Animated.Text>
        </Animated.View>
      )}
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

function sortCompetitionByDate(competition) {
  return competition.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });
}

export default function CompetitionOverviewScreen({ navigation, route }) {
  const { mode } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;

  // get data

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const CompetitionData = await getCompetition(mode);
        const sortedCompetition = sortCompetitionByDate(CompetitionData);
        setData(sortedCompetition);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, [navigation]);

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

  if (data.length == 0) {
    return <NoItemsDisplayer text={`NO ${mode.toUpperCase()} FOR NOW`} />;
  }

  return (
    <Background>
      {loadingImages ? (
        <LoadinSpinner />
      ) : (
        <Title
          data={data}
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
      )}
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
              item={item}
              scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
              positionAnimatedValue={positionAnimatedValue}
              navigation={navigation}
              setLoadingImages={setLoadingImages}
            />
          </View>
        ))}
      </AnimatedPagerView>
      {loadingImages ? (
        <LoadinSpinner />
      ) : (
        <>
          <Pagination
            data={data}
            scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
            positionAnimatedValue={positionAnimatedValue}
          />
          <View style={styles.textContainer}>
            <PrimaryButton
              onPress={() => {}}
              buttonText={`To create ${mode.slice(
                0,
                -1
              )}, please contact leonimail100@gmail.com`}
              buttonTextStyle={styles.text}
            />
          </View>
        </>
      )}
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
    top: 100,
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
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.03,
  },
});
