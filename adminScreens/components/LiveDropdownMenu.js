// External Libraries
import { StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

// Internal Modules
import dimensions from "../../constants/dimensions";
import colors from "../../constants/colors";

const LiveDropdownMenu = ({ setSelectedMode }) => {
  const modes = [
    { key: "1", value: "Regular game" },
    { key: "2", value: "Penalty kicks" },
  ];

  useEffect(() => {
    setSelectedMode("Regular game");
  }, []);

  return (
    <View style={styles.container}>
      <SelectList
        setSelected={(val) => setSelectedMode(val)}
        data={modes}
        save="value"
        search={false}
        defaultOption={{ key: "1", value: "Regular game" }}
        boxStyles={styles.selectListBox}
        dropdownStyles={styles.selectListDropdown}
        inputStyles={styles.inputStyles}
        dropdownTextStyles={styles.dropdownTextStyles}
        arrowicon={
          <Ionicons
            name="chevron-down-outline"
            size={dimensions.screenWidth * 0.025}
            color={colors.headerTextColor}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    zIndex: 1, // Ensure the dropdown is above other elements
    width: "40%",
  },
  selectListBox: {
    height: dimensions.screenWidth * 0.1,
    justifyContent: "space-between", // Center items horizontally
    alignItems: "center", // Center items vertically
  },
  selectListDropdown: {
    width: "100%",
    position: "absolute",
    top: 40,
    backgroundColor: "black",
  },
  inputStyles: {
    color: colors.headerTextColor,
    textAlign: "center", // Center the text horizontally
    fontSize: dimensions.screenWidth * 0.03,
  },
  dropdownTextStyles: {
    color: colors.headerTextColor,
  },
});

export default LiveDropdownMenu;
