import { useState, useEffect } from "react";
import { Button, View, Modal, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimeModifier = ({ visible, seconds, setManualSeconds, onClose }) => {
  const [selectedMinute, setSelectedMinute] = useState("0");
  const [selectedSecond, setSelectedSecond] = useState("0");

  useEffect(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    setSelectedMinute(String(minutes));
    setSelectedSecond(String(remainingSeconds));
  }, [visible]);

  const handleConfirm = () => {
    newSeconds = parseInt(selectedMinute) * 60 + parseInt(selectedSecond);
    setManualSeconds(newSeconds);
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text>Modify Time</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMinute}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
              numberOfLines={1}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedSecond}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSecond(itemValue)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <Picker.Item key={i} label={`${i}`} value={`${i}`} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: "row", marginTop: 50 }}>
            <Button title="Cancel" onPress={() => onClose()} />
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 100,
    height: 150,
  },
});

export default TimeModifier;
