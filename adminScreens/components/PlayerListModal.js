import React from "react";
import { postData } from "../../util/https";
import {
  Modal,
  Text,
  FlatList,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";

async function postEvent(data, key) {
  id = `events/${key}`;
  await postData(data, id);
}

const PlayerListModal = ({ visible, event, firebaseKey, players, onClose }) => {
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.playerItem}
      onPress={async () => {
        await postEvent(
          {
            ...event,
            player: item.name,
          },
          firebaseKey
        );
        onClose();
      }}
    >
      <Text>{item.name}</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeaderText}>
          <Text>
            {event["team"]} team {event["event"]}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.selectPlayerText}>Select player</Text>
          <FlatList
            data={players}
            keyExtractor={(item) => item.number}
            renderItem={renderItem}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f0f0f0", // Background color for the header
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
  },
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%", // Ensure full width
    alignItems: "center",
  },
});
