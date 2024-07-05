import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useContext, useState } from "react";
import { getTeams } from "../../util/https";
import Background from "../../components/Background";
import { BasicContext } from "../../store/basic-context";
import LoadinSpinner from "../../components/LoadingSpinner";
function TableScreen() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const basicCtx = useContext(BasicContext);
  const tournament_name = basicCtx.getTournamentName();

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const data = await getTeams(tournament_name);
        const transformData = (data) => {
          const groupedTeams = {};
          data.forEach((team) => {
            const { group, teamName, statistics } = team;
            const { pg, w, l, d, gd, p } = statistics;
            const g = statistics.g.join(":");

            if (!groupedTeams[group]) {
              groupedTeams[group] = { group, teams: [] };
            }

            groupedTeams[group].teams.push({
              name: teamName,
              pg,
              w,
              l,
              d,
              g,
              gd,
              p,
            });
          });

          return Object.values(groupedTeams);
        };
        setTables(transformData(data));
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, []);
  // Sorting teams within each table by points
  tables.forEach((table) => {
    table.teams.sort((a, b) => b.p - a.p);
  });

  if (loading) {
    return (
      <Background>
        <LoadinSpinner />
      </Background>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.tableContainer}>
      <Text style={styles.groupTitle}>Group {item.group}</Text>
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
            // if it's last column, don't put line
          ]}
        >
          <Text style={styles.cell}>{team.name}</Text>
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
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    marginVertical: 10, // razmak među tablicama
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  groupTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    width: "12.5%", // 8 x 12.5
    textAlign: "center",
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    width: "12.5%",
    textAlign: "center",
    color: "white",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    paddingVertical: 3,
  },
  lastCell: {
    borderRightWidth: 2,
  },
});

export default TableScreen;
