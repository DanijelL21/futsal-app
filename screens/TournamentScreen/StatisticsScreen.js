// External Libraries
import { useState, useEffect, useContext } from "react";
import { Text, StyleSheet, View, FlatList, TextInput } from "react-native";

// Internal Modules
import Background from "../../components/Background";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";
import colors from "../../constants/colors";
import {
  GoalButton,
  AssistButton,
  RedCardButton,
  YellowCardButton,
} from "../../adminScreens/components/IconButtons";
import { getData } from "../../util/https";
import { BasicContext } from "../../store/basic-context";

function StatisticsScreen() {
  const [sortColumn, setSortColumn] = useState("goal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statistics, setStatistics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const basicCtx = useContext(BasicContext);
  const tournamentInfo = basicCtx.getTournamentData();
  const tournamentName = tournamentInfo.tournamentName;

  useEffect(() => {
    async function getStatistics() {
      const data = await getData(tournamentName, "teams");
      console.log("data", data);
      if (data !== null) {
        const stats = Object.values(data).flatMap((team) => team.players ?? []);
        setStatistics(stats);
      }
    }
    getStatistics();
  }, []);

  useEffect(() => {
    // Sort data whenever sortColumn or sortOrder changes
    const sorted = [...statistics].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.stats[sortColumn] - b.stats[sortColumn];
      } else {
        return b.stats[sortColumn] - a.stats[sortColumn];
      }
    });
    setStatistics(sorted);
  }, [sortColumn, sortOrder]);

  const handleSort = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const filteredStatistics = statistics.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text
        style={[styles.cell, styles.extraCell]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {item.name}
      </Text>
      <Text
        style={[styles.cell, styles.extraCell]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {item.club}
      </Text>
      <Text style={styles.cell} numberOfLines={1} adjustsFontSizeToFit>
        {item.stats.goals}
      </Text>
      <Text style={styles.cell} numberOfLines={1} adjustsFontSizeToFit>
        {item.stats.assists}
      </Text>
      <Text style={styles.cell} numberOfLines={1} adjustsFontSizeToFit>
        {item.stats.yc}
      </Text>
      <Text style={styles.cell} numberOfLines={1} adjustsFontSizeToFit>
        {item.stats.rc}
      </Text>
    </View>
  );

  if (statistics.length === 0) {
    return <NoItemsDisplayer text={"NO STATISTICS FOR NOW"} />;
  }

  return (
    <Background>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by player name..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.extraCell]}>Player</Text>
        <Text style={[styles.headerCell, styles.extraCell]}>Club</Text>
        <GoalButton onPress={() => handleSort("goals")} />
        <AssistButton onPress={() => handleSort("assists")} />
        <YellowCardButton onPress={() => handleSort("yc")} />
        <RedCardButton onPress={() => handleSort("rc")} />
      </View>
      <FlatList
        data={filteredStatistics}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.club}-${item.number}-${item.name}`}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    color: "#000",
  },
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
