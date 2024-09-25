// External Libraries
import { useState } from "react";
import { Button, View, Modal, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

// Internal Modules
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";

const OptionsPicker = ({ visible, options, setOption, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(options[0] || "");

  const handleConfirm = () => {
    setOption(selectedOption);
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Select Option</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedOption}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedOption(itemValue)}
            >
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: "row", marginTop: 50 }}>
            <Button title="Cancel" onPress={onClose} />
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
    width: dimensions.screenWidth * 0.8,
    padding: 20,
    backgroundColor: colors.headerTextColor,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: dimensions.screenWidth * 0.05,
    marginBottom: 20,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: dimensions.screenWidth * 0.6,
    height: dimensions.screenWidth * 0.4,
  },
});

export default OptionsPicker;
