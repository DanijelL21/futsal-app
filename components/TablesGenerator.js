import { getData } from "../util/https";
import { addFirebaseKey } from "./commonTranforms";

async function getTeams(tournamentName) {
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
    return transformedData;
  } catch (error) {
    return [];
  }
}

async function getGamesData(tournamentName) {
  try {
    const games = await getData(tournamentName, "games/Group Stage");
    if (games) {
      return games;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}

async function generateTables(tournamentName) {
  const tables = await getTeams(tournamentName);
  const games = await getGamesData(tournamentName);
  tables.forEach((table) => {
    // Initialize the penaltyWins object
    const penaltyWins = {};
    table.teams.forEach((team) => {
      penaltyWins[team.name] = 0;
    });

    // Count penalty wins based on the "advantage" field
    Object.values(games).forEach((game) => {
      if (game.advantage) {
        const winningTeam = game[game.advantage]; // "away" or "home" team
        penaltyWins[winningTeam] += 1;
      }
    });

    // Sort the teams
    table.teams.sort((teamA, teamB) => {
      // First sort by points
      if (teamB.p !== teamA.p) {
        return teamB.p - teamA.p;
      }

      // If points are the same, sort by penalty wins
      const penaltyA = penaltyWins[teamA.name] || 0;
      const penaltyB = penaltyWins[teamB.name] || 0;

      if (penaltyB !== penaltyA) {
        return penaltyB - penaltyA;
      }

      // If penalty wins are the same, sort by goal difference
      if (teamB.gd !== teamA.gd) {
        return teamB.gd - teamA.gd;
      }

      // If goal difference is also the same, sort by goals scored
      const goalsA = parseInt(teamA.g.split(":")[0], 10);
      const goalsB = parseInt(teamB.g.split(":")[0], 10);

      return goalsB - goalsA;
    });
  });
  return tables;
}

export default generateTables;
