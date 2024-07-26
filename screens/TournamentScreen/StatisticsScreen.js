import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Background from "../../components/Background";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";
import colors from "../../constants/colors";
import {
  GoalButton,
  AssistButton,
  RedCardButton,
  YellowCardButton,
} from "../../adminScreens/components/IconButtons";

function StatisticsScreen() {
  const [sortColumn, setSortColumn] = useState("goal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortedData, setSortedData] = useState([]);

  const statistics = [
    {
      player_one: {
        club: "Texas",
        goal: 10,
        assists: 0,
        "yellow card": 0,
        "red card": 0,
      },
      player_two: {
        club: "Texas",
        goal: 5,
        assists: 0,
        "yellow card": 1,
        "red card": 0,
      },
      player_three: {
        club: "Texas",
        goal: 1,
        assists: 1,
        "yellow card": 0,
        "red card": 1,
      },
    },
  ];

  // Flatten the statistics data into an array of players
  const data = statistics.flatMap((stats) =>
    Object.keys(stats).map((key) => ({
      player: key.replace(/_/g, " "),
      ...stats[key],
    }))
  );

  useEffect(() => {
    // Sort data whenever sortColumn or sortOrder changes
    const sorted = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortColumn] - b[sortColumn];
      } else {
        return b[sortColumn] - a[sortColumn];
      }
    });
    setSortedData(sorted);
  }, [sortColumn, sortOrder]);

  const handleSort = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.extraCell]}>{item.player}</Text>
      <Text style={[styles.cell, styles.extraCell]}>{item.club}</Text>
      <Text style={styles.cell}>{item.goal}</Text>
      <Text style={styles.cell}>{item.assists}</Text>
      <Text style={styles.cell}>{item["yellow card"]}</Text>
      <Text style={styles.cell}>{item["red card"]}</Text>
    </View>
  );

  if (data.length === 0) {
    return <NoItemsDisplayer text={"NO STATISTICS FOR NOW"} />;
  }

  return (
    <Background>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.extraCell]}>Player</Text>
        <Text style={[styles.headerCell, styles.extraCell]}>Club</Text>
        <GoalButton onPress={() => handleSort("goal")} />
        <AssistButton onPress={() => handleSort("assists")} />
        <YellowCardButton onPress={() => handleSort("yellow card")} />
        <RedCardButton onPress={() => handleSort("red card")} />
      </View>
      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.player}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 0,
    color: "#fff",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
    paddingVertical: 10,
  },
  cell: {
    textAlign: "center",
    paddingVertical: 7,
    paddingHorizontal: 11,
    color: "#fff",
    flex: 1,
  },
  extraCell: {
    flex: 6,
  },
});

export default StatisticsScreen;
