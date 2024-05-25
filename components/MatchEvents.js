// EventList.js

import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { deleteData } from "../util/https";

function MatchEvents({ eventsList, handleDeleteEvent }) {
  const renderItem = ({ item }) => {
    const isHomeTeamEvent = item.team === "home";
    const eventContainerStyle = isHomeTeamEvent
      ? styles.homeTeamEventItem
      : styles.awayTeamEventItem;

    const deleteEventPress = async () => {
      if (handleDeleteEvent) {
        await deleteData(item.eventKey, `events/${item.firebaseKey}`);
        handleDeleteEvent();
      }
    };

    return (
      <View style={[styles.eventItem, eventContainerStyle]}>
        <Text style={styles.textEvent}>
          {item.event} by {item.player} {item.time}'
        </Text>
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
    if (event.event === "goal") {
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
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    flexDirection: "row",
  },
  homeTeamEventItem: {
    backgroundColor: "lightgreen",
    alignSelf: "flex-start",
  },
  awayTeamEventItem: {
    backgroundColor: "lightblue",
    alignSelf: "flex-end",
  },
  removeEvent: {
    fontSize: 15,
    color: "red",
    marginLeft: 10,
  },
  textEvent: {
    fontSize: 15,
  },
});

export { MatchEvents, goalsHandler };
