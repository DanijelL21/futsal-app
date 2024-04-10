import { Text, View, FlatList } from "react-native";
import { getTeams } from "../../util/https";
import { useEffect, useState, useCallback } from "react";
import TeamsButton from "./components/TeamsButton";
import PrimaryButton from "../../components/Button";
import { useFocusEffect } from "@react-navigation/native";

function TeamsScreen({ navigation, route }) {
  const isAdmin = route.params.isAdmin;
  const [teamsList, setTeamsList] = useState([]);

  function addTeams() {
    navigation.navigate("HandleTeams", {
      nrOfTeams: teamsList.length,
    });
  }

  function teamDetailsNavigation(team) {
    navigation.navigate("TeamDetails", {
      firebaseKey: team.firebaseKey,
      isAdmin: isAdmin,
    });
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchTeams() {
        try {
          const teams = await getTeams();
          const filteredTeams = teams.filter((team) => team !== null);
          if (filteredTeams.length > 0) {
            filteredTeams.sort((a, b) => (a.group > b.group ? 1 : -1));
          }
          setTeamsList(filteredTeams);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
      fetchTeams();
    }, [])
  );

  function renderTeam(itemData) {
    return (
      <TeamsButton
        onPress={() => teamDetailsNavigation(itemData.item)}
        team={itemData.item.teamName}
        group={itemData.item.group}
      />
    );
  }

  function renderHeader() {
    return (
      <PrimaryButton
        onPress={addTeams}
        buttonText={"Add team"}
        buttonColor={"#8c65db"}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={teamsList}
        keyExtractor={(item) => item.id}
        renderItem={renderTeam}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No teams for now</Text>
          </View>
        }
        ListHeaderComponent={isAdmin ? renderHeader : null}
      />
    </View>
  );
}

export default TeamsScreen;
