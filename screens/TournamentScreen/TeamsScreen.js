import { Text, View, FlatList, StyleSheet } from "react-native";
import { getTeams } from "../../util/https";
import { useState, useCallback, useContext } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { useFocusEffect } from "@react-navigation/native";
import Background from "../../components/Background";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
const ADD_TEAM_PADDING = dimensions.screenWidth * 0.1;
const ADD_TEAM_FONT_SIZE = dimensions.screenWidth * 0.05;
const TEAM_PADDING = dimensions.screenWidth * 0.0375;
const TEAM_FONT_SIZE = dimensions.screenWidth * 0.0375;

function TeamsScreen({ navigation, route }) {
  const [teamsList, setTeamsList] = useState([]);

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useFocusEffect(
    useCallback(() => {
      async function fetchTeams() {
        try {
          const teams = await getTeams(tournament_name);
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

  function teamDetailsNavigation(team) {
    navigation.navigate("TeamDetails", {
      firebaseKey: team.firebaseKey,
      isAdmin: isAdmin,
    });
  }

  function teamsHandler(itemData) {
    return (
      <View style={styles.teamsContainer}>
        <SecondaryButton
          onPress={() => teamDetailsNavigation(itemData.item)}
          buttonStyle={styles.teamsButton}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.teams}>{itemData.item.teamName}</Text>
            <Text style={styles.teams}>({itemData.item.group})</Text>
          </View>
        </SecondaryButton>
      </View>
    );
  }

  function addTeams() {
    navigation.navigate("HandleTeams", {
      nrOfTeams: teamsList.length,
    });
  }

  function addTeamHandler() {
    return (
      <View style={styles.addTeamContainer}>
        <PrimaryButton
          onPress={addTeams}
          buttonText={"Add team"}
          buttonStyle={styles.addTeamButton}
          buttonTextStyle={styles.addTeam}
        />
      </View>
    );
  }

  return (
    <Background>
      <FlatList
        data={teamsList}
        keyExtractor={(item) => item.id}
        renderItem={teamsHandler}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>No teams for now</Text>
          </View>
        }
        ListHeaderComponent={isAdmin ? addTeamHandler : null}
      />
    </Background>
  );
}

export default TeamsScreen;

const styles = StyleSheet.create({
  addTeamContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
    alignItems: "center",
  },
  addTeamButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.redNoticeColor,
    paddingHorizontal: ADD_TEAM_PADDING,
    paddingVertical: ADD_TEAM_PADDING / 4,
  },
  addTeam: {
    color: colors.redNoticeColor,
    fontSize: ADD_TEAM_FONT_SIZE,
    fontWeight: "bold",
  },
  teamsContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
  },
  teamsButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.headerTextColor,
    paddingHorizontal: TEAM_PADDING,
    paddingVertical: TEAM_PADDING,
  },
  teams: {
    color: colors.headerTextColor,
    fontSize: TEAM_FONT_SIZE,
    fontWeight: "bold",
  },
});
