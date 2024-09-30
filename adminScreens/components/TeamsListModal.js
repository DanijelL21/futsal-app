// External Libraries
import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Internal Modules
import Background from "../../components/Background";
import { getData } from "../../util/https";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";
import { addFirebaseKey } from "../../components/commonTranforms";
const TeamsListModal = ({
  competitionName,
  visible,
  setTeam,
  teamType,
  onClose,
}) => {
  const [teamsList, setTeamsList] = useState(null);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const data = await getData(competitionName, "teams");
        const teams = addFirebaseKey(data);
        setTeamsList(teams);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }
    fetchTeamData();
  }, []);

  const handleTeamSelect = (team) => {
    setTeam(teamType, team.teamName);
    onClose();
  };

  const renderTeamItem = ({ item }) => (
    <PrimaryButton
      onPress={() => handleTeamSelect(item)}
      buttonText={item.teamName}
      buttonStyle={styles.teamItem}
      buttonTextStyle={styles.teamText}
    />
  );

  return (
    <Modal visible={visible} animationType="slide">
      <Background>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderText}>
            <Text style={styles.modalHeaderTextStyle}>
              SELECT {teamType} TEAM
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <FlatList
              data={teamsList}
              keyExtractor={(item) => item.id}
              renderItem={renderTeamItem}
              scrollIndicatorInsets={{ right: 1 }}
            />
            <PrimaryButton
              onPress={onClose}
              buttonText={"Close"}
              buttonStyle={styles.finalButton}
              buttonTextStyle={[
                styles.finalButtonText,
                { color: colors.redNoticeColor },
              ]}
            />
          </View>
        </SafeAreaView>
      </Background>
    </Modal>
  );
};

export default TeamsListModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: 50,
  },
  modalHeaderText: {
    alignItems: "center",
    padding: 16,
    marginBottom: 15,
    borderBottomWidth: 2,
    color: colors.headerTextColor,
    borderBottomColor: colors.headerTextColor,
  },
  modalHeaderTextStyle: {
    fontWeight: "bold",
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.05,
    textTransform: "uppercase",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  teamItem: {
    padding: dimensions.screenWidth * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
    width: "100%",
    alignItems: "center",
  },
  teamText: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.05,
  },
  finalButton: {
    minWidth: dimensions.screenWidth * 0.3,
    height: dimensions.screenWidth * 0.08,
    marginBottom: dimensions.screenWidth * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  finalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: dimensions.screenWidth * 0.05,
  },
});
