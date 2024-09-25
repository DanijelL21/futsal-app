// External Libraries
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Internal Modules
import { getData } from "../../util/https";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import Background from "../../components/Background";
import colors from "../../constants/colors";
import dimensions from "../../constants/dimensions";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import { addFirebaseKey } from "../../components/commonTranforms";
import LoadinSpinner from "../../components/LoadingSpinner";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";

const ADD_TEAM_PADDING = dimensions.screenWidth * 0.1;
const ADD_TEAM_FONT_SIZE = dimensions.screenWidth * 0.05;
const TEAM_PADDING = dimensions.screenWidth * 0.0375;
const TEAM_FONT_SIZE = dimensions.screenWidth * 0.0375;

function TeamsScreen({ navigation, route }) {
  const [teamsList, setTeamsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  const isAdmin = authCtx.isAuthenticated(tournamentName);

  useFocusEffect(
    useCallback(() => {
      async function fetchTeams() {
        try {
          const data = await getData(tournamentName, "teams");
          const teams = addFirebaseKey(data);
          const filteredTeams = teams.filter((team) => team !== null);
          if (filteredTeams.length > 0) {
            filteredTeams.sort((a, b) => (a.group > b.group ? 1 : -1));
          }
          setTeamsList(filteredTeams);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchTeams();
    }, [])
  );

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

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
    navigation.navigate("HandleTeams");
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

  if (teamsList.length === 0) {
    return (
      <Background>
        {isAdmin && addTeamHandler()}
        <NoItemsDisplayer text={"NO TEAMS FOR NOW"} includeBackground={false} />
      </Background>
    );
  }

  return (
    <Background>
      <FlatList
        data={teamsList}
        keyExtractor={(item) => item.id}
        renderItem={teamsHandler}
        ListHeaderComponent={isAdmin ? addTeamHandler : null}
        scrollIndicatorInsets={{ right: 1 }}
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
