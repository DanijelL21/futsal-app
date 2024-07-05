import { useState, useEffect } from "react";
import { postData } from "../../util/https";
import {
  Modal,
  Text,
  FlatList,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Background from "../../components/Background";
import PrimaryButton from "../../components/buttons/PrimaryButton";

const PlayerListModal = ({
  tournament_name,
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

  async function postEvent(tournament_name, data, key) {
    const id = `events/${key}`;
    await postData(tournament_name, data, id);
  }

  const handlePlayerSelect = async (player) => {
    if (event.event === "goal") {
      setSelectedPlayer(player);
      setSelectingAssist(true);
    } else {
      await postEvent(
        tournament_name,
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
      tournament_name,
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
      tournament_name,
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
            <Button title="Close" onPress={onClose} color={"red"} />
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
    color: "white",
    borderBottomColor: "#ccc",
  },
  modalHeaderTextStyle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectPlayerText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%", // Ensure full width
    alignItems: "center",
  },
  playerText: {
    color: "white",
  },
});
