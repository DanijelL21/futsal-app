import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useEffect, useCallback, useState } from "react";
import PrimaryButton from "../../components/Button";
import { getTeamDetails, deleteData } from "../../util/https";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

function TeamDetailsScreen({ navigation, route }) {
  const [teamData, setTeamData] = useState({});
  const key = route.params.firebaseKey;
  const isAdmin = route.params.isAdmin;

  function modifyTeam() {
    navigation.navigate("HandleTeams", {
      modifyTeamData: teamData,
    });
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchTeamDetails() {
        try {
          const teamDetails = await getTeamDetails(key);
          setTeamData(teamDetails);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
      fetchTeamDetails();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      title: teamData.teamName,
    });
  }, [teamData, navigation]);

  async function deleteTeam() {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete the team?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteData(teamData.firebaseKey, "teams");
              navigation.goBack();
            } catch (error) {
              setError("Could not delete team - please try again later!");
            }
          },
        },
      ],
      { cancelable: false }
    );
  }

  function renderPlayers({ item }) {
    if (!item.name) {
      return null;
    }

    return (
      <View style={styles.playerContainer}>
        <>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerNumber}>{item.number}</Text>
        </>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.managerContainer}>
        <Text style={styles.managerLabel}>Manager: </Text>
        <Text style={styles.managerText}>{teamData.manager}</Text>
      </View>
      <View style={styles.groupContainer}>
        <Text style={styles.groupLabel}>Group: </Text>
        <Text style={styles.groupText}>{teamData.group}</Text>
      </View>
      {isAdmin && (
        <PrimaryButton
          onPress={modifyTeam}
          buttonText={"Modify team"}
          buttonColor={"#8c65db"}
        />
      )}
      <FlatList
        data={teamData.players}
        renderItem={renderPlayers}
        keyExtractor={(item) => item.number + Math.random()} // + Math.random()
      />
      <Pressable
        onPress={deleteTeam}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.buttonContainer}>
          <Ionicons name="trash" size={36} color={"red"} />
        </View>
      </Pressable>
    </View>
  );
}

export default TeamDetailsScreen;

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  playerNumber: {
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
