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
import { postData } from "../../util/https";
import Background from "../../components/Background";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";

const PlayerListModal = ({
  competitionName,
  visible,
  event,
  firebaseKey,
  players,
  onClose,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectingAssist, setSelectingAssist] = useState(false);

  useEffect(() => {
    if (!visible) {
      // Reset state when modal is closed
      setSelectedPlayer(null);
      setSelectingAssist(false);
    }
  }, [visible]);

  async function postEvent(competitionName, data, key) {
    const id = `events/${key}`;
    console.log("PUTTING EVENT", data);
    await postData(competitionName, data, id);
  }

  const handlePlayerSelect = async (player) => {
    if (event.event === "goal") {
      setSelectedPlayer(player);
      setSelectingAssist(true);
    } else {
      await postEvent(
        competitionName,
        {
          ...event,
          player: player.name,
        },
        firebaseKey
      );
      onClose();
    }
  };

  const handleAssistSelect = async (assistPlayer) => {
    await postEvent(
      competitionName,
      {
        ...event,
        player: selectedPlayer.name,
        assist: assistPlayer.name,
      },
      firebaseKey
    );
    onClose();
  };

  const handleNoneSelect = async () => {
    await postEvent(
      competitionName,
      {
        ...event,
        player: selectedPlayer.name,
        assist: "NONE",
      },
      firebaseKey
    );
    onClose();
  };

  const renderPlayerItem = ({ item }) => (
    <PrimaryButton
      onPress={() => handlePlayerSelect(item)}
      buttonText={item.name}
      buttonStyle={styles.playerItem}
      buttonTextStyle={styles.playerText}
    />
  );

  const renderAssistItem = ({ item }) => (
    <PrimaryButton
      onPress={() => handleAssistSelect(item)}
      buttonText={item.name}
      buttonStyle={styles.playerItem}
      buttonTextStyle={styles.playerText}
    />
  );

  return (
    <Modal visible={visible} animationType="slide">
      <Background>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderText}>
            <Text style={styles.modalHeaderTextStyle}>
              {event["team"]} team {event["event"]}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.selectPlayerText}>
              {selectingAssist ? "Select assist player" : "Select player"}
            </Text>
            <FlatList
              data={players}
              keyExtractor={(item) => item.number}
              renderItem={selectingAssist ? renderAssistItem : renderPlayerItem}
              scrollIndicatorInsets={{ right: 1 }}
              ListFooterComponent={
                selectingAssist && (
                  <PrimaryButton
                    onPress={handleNoneSelect}
                    buttonText={"NONE"}
                    buttonStyle={styles.playerItem}
                    buttonTextStyle={styles.playerText}
                  />
                )
              }
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

export default PlayerListModal;

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
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectPlayerText: {
    marginBottom: 10,
    fontSize: dimensions.screenWidth * 0.04,
    fontWeight: "bold",
    color: colors.headerTextColor,
  },
  playerItem: {
    padding: dimensions.screenWidth * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
    width: "100%",
    alignItems: "center",
  },
  playerText: {
    color: colors.headerTextColor,
    fontSize: dimensions.screenWidth * 0.03,
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
