import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { getData } from "../util/https";
import { addFirebaseKey } from "./commonTranforms";

export const generateTables = (tournamentName) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamesData, setGamesData] = useState("");

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teams = await getData(tournamentName, "teams");
        const data = addFirebaseKey(teams);

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

        const transformedData = transformData(data);
        transformedData.sort((a, b) => a.group.localeCompare(b.group));
        setTables(transformedData);
      } catch (error) {
        Alert.alert("Error fetching tables", "Please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [tournamentName]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const games = await getData(tournamentName, "games/Group Stage");
        if (games) {
          setGamesData(games);
        }
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGameData();
  }, [tournamentName]);

  const sortGroup = (teams) => {
    const penaltyWins = {};
    teams.forEach((team) => {
      penaltyWins[team.name] = 0;
    });

    Object.values(gamesData).forEach((game) => {
      if (game.advantage) {
        const winningTeam = game[game.advantage];
        penaltyWins[winningTeam] += 1;
      }
    });

    teams.sort((teamA, teamB) => {
      if (teamB.p !== teamA.p) {
        return teamB.p - teamA.p;
      }
      const penaltyA = penaltyWins[teamA.name] || 0;
      const penaltyB = penaltyWins[teamB.name] || 0;

      if (penaltyB !== penaltyA) {
        return penaltyB - penaltyA;
      }
      if (teamB.gd !== teamA.gd) {
        return teamB.gd - teamA.gd;
      }
      const goalsA = parseInt(teamA.g.split(":")[0], 10);
      const goalsB = parseInt(teamB.g.split(":")[0], 10);

      return goalsB - goalsA;
    });
  };

  // Sort teams in each group
  tables.forEach((table) => {
    sortGroup(table.teams);
  });

  return { tables, loading };
};
