import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { deleteData } from "../util/https";
import {
  GoalButton,
  OwnGoalButton,
  PenaltyButton,
  PenaltyMissedButton,
  RedCardButton,
  YellowCardButton,
} from "../adminScreens/components/IconButtons";

const formatPlayerName = (player) => {
  try {
    const [firstName, ...lastNameParts] = player.split(" ");
    const lastName = lastNameParts.join(" ");
    return `${firstName.charAt(0)}.${lastName}`;
  } catch (error) {
    return player;
  }
};

function MatchEvents({ tournament_name, eventsList, handleDeleteEvent }) {
  const renderItem = ({ item, index }) => {
    const isHomeTeamEvent = item.team === "home";
    const eventContainerStyle = isHomeTeamEvent
      ? styles.homeTeamEventItem
      : styles.awayTeamEventItem;

    const deleteEventPress = async () => {
      if (handleDeleteEvent) {
        await deleteData(
          tournament_name,
          `events/${item.firebaseKey}`,
          item.eventKey
        );
        handleDeleteEvent();
      }
    };

    const currentEvents = eventsList.slice(0, index + 1);
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
            ) : item.event === "own goal" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <View style={styles.scoreContainer}>
                  <OwnGoalButton />
                  <Text style={styles.displayedText}>{score}</Text>
                </View>
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "yellow card" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <YellowCardButton />
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "red card" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <RedCardButton />
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : item.event === "penalty scored" ? (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
                <View style={styles.scoreContainer}>
                  <PenaltyButton />
                  <Text style={styles.displayedText}>{score}</Text>
                </View>
                <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              </>
            ) : (
              <>
                <Text style={styles.displayedText}>{item.time}'</Text>
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
          ) : item.event === "own goal" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <View style={styles.scoreContainer}>
                <OwnGoalButton />
                <Text style={styles.displayedText}>{score}</Text>
              </View>
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "yellow card" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <YellowCardButton />
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "red card" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <RedCardButton />
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : item.event === "penalty scored" ? (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <View style={styles.scoreContainer}>
                <PenaltyButton />
                <Text style={styles.displayedText}>{score}</Text>
              </View>

              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          ) : (
            <>
              <Text style={styles.displayedText}>{formattedPlayerName}</Text>
              <PenaltyMissedButton />
              <Text style={styles.displayedText}>{item.time}'</Text>
            </>
          )}
        </View>
      );
    }

    return (
      <View style={[styles.eventItem, eventContainerStyle]}>
        {displayedText(item)}
        {handleDeleteEvent && (
          <Pressable onPress={deleteEventPress}>
            <Text style={styles.removeEvent}>x</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={eventsList}
      keyExtractor={(item) => item.eventKey}
      renderItem={renderItem}
    />
  );
}

function goalsHandler(events) {
  let homeGoals = 0;
  let awayGoals = 0;

  events.forEach((event) => {
    if (event.event === "goal" || event.event === "penalty scored") {
      if (event.team === "home") {
        homeGoals++;
      } else if (event.team === "away") {
        awayGoals++;
      }
    }
    if (event.event === "own goal") {
      if (event.team === "away") {
        homeGoals++;
      } else if (event.team === "home") {
        awayGoals++;
      }
    }
  });
  return { homeGoals, awayGoals };
}

const styles = StyleSheet.create({
  eventItem: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center", // Added to vertically center items
  },
  homeTeamEventItem: {
    alignSelf: "flex-start",
  },
  awayTeamEventItem: {
    alignSelf: "flex-end",
  },
  removeEvent: {
    fontSize: 15,
    color: "red",
    marginLeft: 10,
  },
  displayedTextContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  displayedText: {
    size: 15,
    color: "white",
  },
  scoreContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1, // Set the border width
    borderColor: "white", // Set the border color (black in this case)
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    paddingRight: 5,
  },
});

export { MatchEvents, goalsHandler };
