// External Libraries
import { Modal, Text, View, StyleSheet, SafeAreaView } from "react-native";

// Internal Modules
import Background from "./Background";
import PrimaryButton from "./buttons/PrimaryButton";
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";

const PlayerStatisticsModal = ({ playerInfo, visible, onClose }) => {
  if (playerInfo == "") {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide">
      <Background>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderText}>
            <Text style={styles.modalHeaderTextStyle}>
              {playerInfo.number}. {playerInfo.name}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>GOALS: {playerInfo.stats.goals}</Text>
            <Text style={styles.infoText}>
              ASSISTS: {playerInfo.stats.assists}
            </Text>
            <Text style={styles.infoText}>
              YELLOW CARDS: {playerInfo.stats.yc}
            </Text>
            <Text style={styles.infoText}>
              RED CARDS: {playerInfo.stats.rc}
            </Text>
          </View>
          <View style={styles.closeContainer}>
            <PrimaryButton
              onPress={onClose}
              buttonText={"Close"}
              buttonStyle={styles.finalButton}
              buttonTextStyle={styles.finalButtonText}
            />
          </View>
        </SafeAreaView>
      </Background>
    </Modal>
  );
};

export default PlayerStatisticsModal;

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
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.06,
    marginBottom: 10,
  },
  closeContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  finalButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: dimensions.screenWidth * 0.05,
  },
  finalButtonText: {
    color: colors.redNoticeColor,
    textAlign: "center",
    fontSize: dimensions.screenWidth * 0.09,
  },
});
