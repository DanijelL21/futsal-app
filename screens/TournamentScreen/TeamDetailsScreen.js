import { Text, View, FlatList, StyleSheet, Alert } from "react-native";
import { useEffect, useCallback, useState, useContext } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { getTeamDetails } from "../../util/https";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { deleteData } from "../../util/https";
import Background from "../../components/Background";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";
import { BasicContext } from "../../store/basic-context";
import { AuthContext } from "../../store/auth-context";
import LoadinSpinner from "../../components/LoadingSpinner";
const MODIFY_TEAM_PADDING = dimensions.screenWidth * 0.1;
const MODIFY_TEAM_FONT_SIZE = dimensions.screenWidth * 0.05;
const TITLE_SIZE = dimensions.screenWidth * 0.0625;
const PLAYER_INFO_SIZE = dimensions.screenWidth * 0.0375;

function TeamDetailsScreen({ navigation, route }) {
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  const key = route.params.firebaseKey;

  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.isAuthenticated;
  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useFocusEffect(
    useCallback(() => {
      async function fetchTeamDetails() {
        try {
          const teamDetails = await getTeamDetails(tournament_name, key);
          setTeamData(teamDetails);
        } catch (error) {
          console.error("Error fetching teams:", error);
        } finally {
          setLoading(false);
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

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

  function modifyTeam() {
    console.log(teamData);
    navigation.navigate("HandleTeams", {
      modifyTeamData: teamData,
    });
  }

  function handlePlayersList({ item }) {
    if (!item.name) {
      return null;
    }
    return (
      <View style={styles.playersContainer}>
        <Text style={styles.playerInfo}>{item.name}</Text>
        <Text style={styles.playerInfo}>{item.number}</Text>
      </View>
    );
  }

  return (
    <Background>
      {isAdmin && (
        <View style={styles.modifyTeamContainer}>
          <PrimaryButton
            onPress={modifyTeam}
            buttonText={"Modify team"}
            buttonStyle={styles.modifyTeamButton}
            buttonTextStyle={styles.modifyTeam}
          />
        </View>
      )}
      <View style={styles.managerAndGroupContainer}>
        <Text style={styles.managerAndGroup}>Manager: </Text>
        <Text style={styles.data}>{teamData.manager}</Text>
      </View>
      <View style={styles.managerAndGroupContainer}>
        <Text style={styles.managerAndGroup}>Group: </Text>
        <Text style={styles.data}>{teamData.group}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>PLAYERS</Text>
      </View>
      <FlatList
        data={teamData.players}
        renderItem={handlePlayersList}
        keyExtractor={(item) => item.number + Math.random()}
      />
      {isAdmin && (
        <View style={styles.deleteContainer}>
          <SecondaryButton
            onPress={() =>
              Alert.alert(
                "Confirm Changes",
                `Are you sure you want to delete team?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Add",
                    style: "destructive",
                    onPress: async () => {
                      await deleteData(
                        tournament_name,
                        "teams",
                        teamData.firebaseKey
                      );
                      navigation.goBack();
                    },
                  },
                ],
                { cancelable: false }
              )
            }
          >
            <Ionicons name="trash" size={36} color={"red"} />
          </SecondaryButton>
        </View>
      )}
    </Background>
  );
}

export default TeamDetailsScreen;

const styles = StyleSheet.create({
  modifyTeamContainer: {
    paddingTop: dimensions.screenWidth * 0.05,
    alignItems: "center",
  },
  modifyTeamButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.redNoticeColor,
    paddingHorizontal: MODIFY_TEAM_PADDING,
    paddingVertical: MODIFY_TEAM_PADDING / 4,
  },
  modifyTeam: {
    color: colors.redNoticeColor,
    fontSize: MODIFY_TEAM_FONT_SIZE,
    fontWeight: "bold",
  },
  managerAndGroupContainer: {
    flexDirection: "row",
    marginTop: dimensions.screenWidth * 0.05,
  },
  managerAndGroup: {
    fontSize: dimensions.screenWidth * 0.05,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  data: {
    fontSize: dimensions.screenWidth * 0.05,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: dimensions.screenWidth * 0.05,
  },
  titleText: {
    fontSize: TITLE_SIZE,
    fontWeight: "bold",
    color: colors.headerTextColor,
    marginBottom: dimensions.screenWidth * 0.05,
  },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: dimensions.screenWidth * 0.025,
    paddingHorizontal: dimensions.screenWidth * 0.05,
    borderBottomWidth: 2,
    borderBottomColor: colors.headerTextColor,
  },
  playerInfo: {
    fontSize: PLAYER_INFO_SIZE,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  deleteContainer: {
    alignContent: "center",
    alignItems: "center",
    marginTop: dimensions.screenWidth * 0.025,
    marginBottom: dimensions.screenWidth * 0.1,
  },
});
