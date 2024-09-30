// External Libraries
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useState, useEffect } from "react";

// Internal Modules
import { deleteData } from "../util/https";
import {
  GoalButton,
  OwnGoalButton,
  PenaltyButton,
  PenaltyMissedButton,
  RedCardButton,
  YellowCardButton,
} from "../adminScreens/components/IconButtons";
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";

const formatPlayerName = (player) => {
  try {
    const parts = player.split(" ");
    if (parts.length === 1) {
      return player; // Return the single word as is
    }
    const [firstName, ...lastNameParts] = parts;
    const lastName = lastNameParts.join(" ");
    return `${lastName}.${firstName.charAt(0)}`;
  } catch (error) {
    return player;
  }
};

function goalsHandler(events) {
  let homeGoals = 0;
  let awayGoals = 0;

  events.forEach((event) => {
    if (
      (event.event === "goal" || event.event === "penaltyScored") &&
      event.mode != "Advantage penalty"
    ) {
      if (event.team === "home") {
        homeGoals++;
      } else if (event.team === "away") {
        awayGoals++;
      }
    }
    if (event.event === "ownGoal") {
      if (event.team === "away") {
        homeGoals++;
      } else if (event.team === "home") {
        awayGoals++;
      }
    }
  });
  return { homeGoals, awayGoals };
}

function MatchEvents({ competitionName, eventsList, handleDeleteEvent }) {
  const [matchMode, setMatchMode] = useState("");

  const sortedEvents = eventsList.sort((a, b) => a.time - b.time);
  // useEffect to set matchMode based on the eventsList
  useEffect(() => {
    const penaltyKickEvent = sortedEvents.find(
      (item) => item.mode !== "Regular game"
    );
    if (penaltyKickEvent) {
      setMatchMode(penaltyKickEvent.mode); // Use penaltyKickEvent.mode here
    } else {
      setMatchMode(""); // Reset the mode if no event is found
    }
  }, [sortedEvents]);

  const renderItem = ({ item, index }) => {
    const isHomeTeamEvent = item.team === "home";
    const eventContainerStyle = isHomeTeamEvent
      ? styles.homeTeamEventItem
      : styles.awayTeamEventItem;

    const deleteEventPress = async () => {
      if (handleDeleteEvent) {
        await deleteData(
          competitionName,
          `events/${item.firebaseKey}`,
          item.eventKey
        );
        handleDeleteEvent();
      }
    };

    const currentEvents = sortedEvents.slice(0, index + 1);
    const { homeGoals, awayGoals } = goalsHandler(currentEvents);
    const formattedPlayerName = formatPlayerName(item.player);
    const score = `${homeGoals}-${awayGoals}`;

    function displayedText(item) {
      return (
        <View style={styles.displayedTextContainer}>
          {item.team === "home" ? (
            item.event === "goal" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <View style={styles.scoreContainer}>
                  <GoalButton />
                  <Text style={styles.displayedText}>{score}</Text>
                </View>
                <View>
                  <Text style={styles.displayedText}>
                    {formattedPlayerName}
                  </Text>
                  {item.assist !== "NONE" && (
                    <Text style={[styles.displayedText, { opacity: 0.5 }]}>
                      {formatPlayerName(item.assist)}
                    </Text>
                  )}
                </View>
              </>
            ) : item.event === "ownGoal" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <View style={styles.scoreContainer}>
                  <OwnGoalButton />
                  <Text style={styles.displayedText}>{score}</Text>
                </View>
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "yellowCard" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <YellowCardButton />
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "redCard" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <RedCardButton />
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "penaltyScored" ? (
              <>
                {item.mode === "Regular game" && (
                  <Text style={styles.displayedText}>{item.time}'</Text>
                )}
                <View
                  style={
                    item.mode != "Advantage penalty" && styles.scoreContainer
                  }
                >
                  <PenaltyButton />
                  {item.mode !== "Advantage penalty" && (
                    <Text style={styles.displayedText}>{score}</Text>
                  )}
                </View>
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : (
              <>
                {item.mode === "Regular game" && (
                  <Text style={styles.displayedText}>{item.time}'</Text>
                )}
                <PenaltyMissedButton />
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            )
          ) : item.event === "goal" ? (
            <>
              <View>
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
                {item.assist !== "NONE" && (
                  <Text style={[styles.displayedText, { opacity: 0.5 }]}>
                    {formatPlayerName(item.assist)}
                  </Text>
                )}
              </View>
              <View style={styles.scoreContainer}>
                <GoalButton />
                <Text style={styles.displayedText}>{score}</Text>
              </View>

              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "ownGoal" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <View style={styles.scoreContainer}>
                <OwnGoalButton />
                <Text style={styles.displayedText}>{score}</Text>
              </View>
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "yellowCard" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <YellowCardButton />
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "redCard" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <RedCardButton />
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "penaltyScored" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <View
                style={
                  item.mode != "Advantage penalty" && styles.scoreContainer
                }
              >
                <PenaltyButton />
                {item.mode !== "Advantage penalty" && (
                  <Text style={styles.displayedText}>{score}</Text>
                )}
              </View>

              {item.mode === "Regular game" && (
                <Text style={styles.displayedText}>{item.time}'</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <PenaltyMissedButton />
              {item.mode === "Regular game" && (
                <Text style={styles.displayedText}>{item.time}'</Text>
              )}
            </>
          )}
        </View>
      );
    }

    const showSeparator =
      (item.mode === "Penalty kicks" || item.mode === "Advantage penalty") &&
      index === sortedEvents.findIndex((event) => event.mode === item.mode);

    return (
      <>
        {showSeparator && (
          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>{matchMode}</Text>
            <View style={styles.separator} />
          </View>
        )}
        <View style={[styles.eventItem, eventContainerStyle]}>
          {displayedText(item)}
          {handleDeleteEvent && (
            <Pressable onPress={deleteEventPress}>
              <Text style={styles.removeEvent}>x</Text>
            </Pressable>
          )}
        </View>
      </>
    );
  };

  return (
    <FlatList
      data={sortedEvents}
      keyExtractor={(item) => item.eventKey}
      renderItem={renderItem}
      scrollIndicatorInsets={{ right: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  eventItem: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  homeTeamEventItem: {
    alignSelf: "flex-start",
  },
  awayTeamEventItem: {
    alignSelf: "flex-end",
  },
  removeEvent: {
    fontSize: dimensions.screenWidth * 0.07,
    color: colors.redNoticeColor,
    marginLeft: 10,
  },
  displayedTextContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  displayedText: {
    fontSize: dimensions.screenWidth * 0.05,
    color: colors.headerTextColor,
    marginRight: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.headerTextColor,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    paddingRight: 5,
  },
  separatorContainer: {
    marginTop: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  separatorText: {
    color: "lightgray",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    borderTopColor: "lightgray",
    width: "100%",
    marginTop: 10,
    borderTopWidth: 2,
  },
});

export { MatchEvents, goalsHandler };
