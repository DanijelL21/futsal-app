// External Libraries
import {
  Modal,
  Text,
  FlatList,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Internal Modules
import Background from "./Background";
import PrimaryButton from "./buttons/PrimaryButton";
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";
const PlayersModal = ({ visible, teamData, onClose }) => {
  const renderPlayerItem = ({ item }) => (
    <View style={styles.playerItem}>
      <Text style={styles.playerText}>
        #{item.number} - {item.name}
      </Text>
    </View>
  );
  return (
    <Modal visible={visible} animationType="slide">
      <Background>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderText}>
            <Text style={styles.modalHeaderTextStyle}>{teamData.teamName}</Text>
          </View>
          <View style={styles.inputContainer}>
            <FlatList
              data={teamData.players}
              renderItem={renderPlayerItem}
              keyExtractor={(item) => item.number}
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

export default PlayersModal;

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
    fontSize: dimensions.screenWidth * 0.06,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerItem: {
    padding: dimensions.screenWidth * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
    width: "100%",
    alignItems: "flex-start",
  },
  playerText: {
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
    textAlign: "center",
    fontSize: dimensions.screenWidth * 0.06,
  },
});
