// External Libraries
import { StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useContext } from "react";

// Internal Modules
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";
import { BasicContext } from "../store/basic-context";

const GrupsDropdownMenu = ({ setSelectedPhase }) => {
  const allPhases = [
    { key: "1", value: "Group Stage" },
    { key: "2", value: "Round of 16" },
    { key: "3", value: "Quarter-finals" },
    { key: "4", value: "Semi-finals" },
    { key: "5", value: "Final" },
  ];

  // Filter out the "Round of 16" phase if teamsNr is 16

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();

  const phases =
    tournamentInfo.teamsNr === 16
      ? allPhases.filter((phase) => phase.value !== "Round of 16")
      : allPhases;

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
    height: dimensions.screenWidth * 0.1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectListDropdown: {
    width: "100%",
    position: "absolute",
    top: 40,
    backgroundColor: "black",
  },
  inputStyles: {
    color: colors.headerTextColor,
    textAlign: "center",
    fontSize: dimensions.screenWidth * 0.03,
  },
  dropdownTextStyles: {
    color: "white",
  },
});

export default GrupsDropdownMenu;
