// External Libraries
import { useState, useEffect } from "react";
import { Button, View, Modal, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

// Internal Modules
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";

const TimePicker = ({ visible, setTime, currentDisplayedTime, onClose }) => {
  const [selectedHour, setSelectedHour] = useState("17");
  const [selectedMinute, setSelectedMinute] = useState("00");

  console.log("currentDisplayedTime", currentDisplayedTime);
  // set initial time
  useEffect(() => {
    if (currentDisplayedTime !== "" && currentDisplayedTime !== "TBD") {
      const [hour, minute] = currentDisplayedTime.split(":");
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [currentDisplayedTime]);

  const handleConfirm = () => {
    setTime(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Select Time</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedHour}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map((i) => (
                <Picker.Item
                  key={i}
                  label={formatNumber(i === 24 ? "00" : i)}
                  value={formatNumber(i === 24 ? "00" : i)}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedMinute}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
              numberOfLines={1}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <Picker.Item
                  key={i}
                  label={formatNumber(i)}
                  value={formatNumber(i)}
                />
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
    width: dimensions.screenWidth * 0.7,
    padding: 20,
    backgroundColor: colors.headerTextColor,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    fontSize: dimensions.screenWidth * 0.03,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: dimensions.screenWidth * 0.3,
    height: dimensions.screenWidth * 0.4,
  },
});

export default TimePicker;
