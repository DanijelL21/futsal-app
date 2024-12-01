// External Libraries
import { StyleSheet, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useContext } from "react";

// Internal Modules
import dimensions from "../constants/dimensions";
import colors from "../constants/colors";
import { BasicContext } from "../store/basic-context";

function generateTournamentPhases(teamsNr) {
  const allPhases = [
    { key: "1", value: "Group Stage" },
    { key: "2", value: "Round of 16" },
    { key: "3", value: "Quarter-finals" },
    { key: "4", value: "Semi-finals" },
    { key: "5", value: "Final" },
  ];

  const phases =
    teamsNr === 16
      ? allPhases.filter((phase) => phase.value !== "Round of 16")
      : allPhases;

  return phases;
}

function generateLeaguesPhases(teamsNr) {
  const rounds = (teamsNr - 1) * 2;
  const allPhases = Array.from({ length: rounds }, (v, i) => ({
    key: (i + 1).toString(),
    value: `Round ${i + 1}`,
  }));

  return allPhases;
}

const GrupsDropdownMenu = ({ setSelectedPhase }) => {
  // Filter out the "Round of 16" phase if teamsNr is 16

  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();

  let phases;
  if (competitionInfo.mode === "tournaments") {
    phases = generateTournamentPhases(competitionInfo.teamsNr);
  } else {
    phases = generateLeaguesPhases(competitionInfo.teamsNr);
  }

  useEffect(() => {
    if (competitionInfo.mode === "tournaments") {
      setSelectedPhase("Group Stage");
    } else {
      setSelectedPhase("Round 1");
    }
  }, []);

  return (
    <View style={styles.container}>
      <SelectList
        setSelected={(val) => setSelectedPhase(val)}
        data={phases}
        save="value"
        search={false}
        defaultOption={
          competitionInfo.mode === "tournaments"
            ? { key: "1", value: "Group Stage" }
            : { key: "1", value: "Round 1" }
        }
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
