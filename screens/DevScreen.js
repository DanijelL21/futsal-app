import React, { useState } from "react";
import { Button, View, Modal, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Background from "../components/Background";

const DevScreen = () => {
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState("0");
  const [selectedSecond, setSelectedSecond] = useState("0");

  const togglePickerVisibility = () => {
    setPickerVisibility((currentValue) => !currentValue);
  };

  const handleConfirm = () => {
    console.log("Selected time: ", selectedMinute + ":" + selectedSecond);

    // Calculate total seconds
    newSeconds = parseInt(selectedMinute) * 60 + parseInt(selectedSecond);
    console.log("New seconds:", newSeconds);

    // set seconds
    togglePickerVisibility();
  };

  return (
    <Background style={styles.container}>
      <Button title="Show Time Picker" onPress={togglePickerVisibility} />
      <Modal transparent={true} animationType="slide" visible={isPickerVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Text>Modify Time</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMinute}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedMinute(itemValue)}
                numberOfLines={1} // velicina kockice
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
              <Button title="Cancel" onPress={togglePickerVisibility} />
              <Button title="Confirm" onPress={handleConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    width: 300, // sirina modala
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

export default DevScreen;
