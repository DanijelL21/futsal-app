import { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { BasicContext } from "../../store/basic-context";
import Background from "../../components/Background";
import LoadinSpinner from "../../components/LoadingSpinner";
import NoItemsDisplayer from "../../components/NoItemsDisplayer";
import generateTables from "../../components/TablesGenerator";
import colors from "../../constants/colors";

function TableScreen() {
  const basicCtx = useContext(BasicContext);
  const competitionInfo = basicCtx.getCompetitionData();
  const competitionName = competitionInfo.competitionName;
  const mode = competitionInfo.mode;

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tablesData = await generateTables(competitionName, mode); // Fetch tables
        setTables(tablesData); // Set the data in state
      } catch (error) {
        Alert.alert("Error fetching tables", "Please try again later");
      } finally {
        setLoading(false); // Hide the loader once data is fetched
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

  if (tables.length === 0) {
    return <NoItemsDisplayer text={"TABLES NOT CREATED"} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.tableContainer}>
      {competitionInfo.mode === "tournaments" && (
        <Text style={styles.groupTitle}>Group {item.group}</Text>
      )}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Team</Text>
        <Text style={styles.headerText}>PG</Text>
        <Text style={styles.headerText}>W</Text>
        <Text style={styles.headerText}>L</Text>
        <Text style={styles.headerText}>D</Text>
        <Text style={styles.headerText}>G</Text>
        <Text style={styles.headerText}>GD</Text>
        <Text style={styles.headerText}>P</Text>
      </View>
      {item.teams.map((team, index) => (
        <View
          key={team.name}
          style={[
            styles.teamRow,
            index === item.teams.length - 1 ? { borderBottomWidth: 0 } : {},
          ]}
        >
          <View style={styles.cell}>
            {team.name.split(" ").map((word, index) => (
              <Text
                key={index}
                style={styles.teamNameText}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {word}
              </Text>
            ))}
          </View>

          <Text style={styles.cell}>{team.pg}</Text>
          <Text style={styles.cell}>{team.w}</Text>
          <Text style={styles.cell}>{team.l}</Text>
          <Text style={styles.cell}>{team.d}</Text>
          <Text style={styles.cell}>{team.g}</Text>
          <Text style={styles.cell}>{team.gd}</Text>
          <Text style={styles.cell}>{team.p}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Background>
      <FlatList
        data={tables}
        renderItem={renderItem}
        keyExtractor={(item) => item.group}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.headerTextColor,
    borderRadius: 5,
  },
  groupTitle: {
    fontSize: 18,
    color: colors.headerTextColor,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
  },
  headerText: {
    color: colors.headerTextColor,
    fontWeight: "bold",
    width: "12.5%",
    textAlign: "center",
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerTextColor,
  },
  cell: {
    width: "12.5%",
    textAlign: "center",
    color: colors.headerTextColor,
    paddingVertical: 3,
  },
  teamNameText: {
    textAlign: "center",
    color: colors.headerTextColor,
  },
});

export default TableScreen;
