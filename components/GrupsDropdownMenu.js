import { StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
const GrupsDropdownMenu = ({ setSelectedPhase }) => {
  const phases = [
    { key: "1", value: "Group Stage" },
    { key: "2", value: "Round of 16" },
    { key: "3", value: "Quarter-finals" },
    { key: "4", value: "Semi-finals" },
    { key: "5", value: "Final" },
  ];

  useEffect(() => {
    setSelectedPhase("Group Stage");
  }, []);

  return (
    <View style={styles.container}>
      <SelectList
        setSelected={(val) => setSelectedPhase(val)}
        data={phases}
        save="value"
        search={false}
        defaultOption={{ key: "1", value: "Group Stage" }}
        boxStyles={styles.selectListBox}
        dropdownStyles={styles.selectListDropdown}
        inputStyles={styles.inputStyles}
        dropdownTextStyles={styles.dropdownTextStyles}
        arrowicon={
          <Ionicons name="chevron-down-outline" size={12} color={"white"} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    zIndex: 1, // Ensure the dropdown is above other elements
    width: "50%",
  },
  selectListBox: {
    height: 50,
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
    color: "white", // color of text displayed
    textAlign: "center", // Center the text horizontally
  },
  dropdownTextStyles: {
    color: "white", // color of text in dropdown menu
  },
});

export default GrupsDropdownMenu;
