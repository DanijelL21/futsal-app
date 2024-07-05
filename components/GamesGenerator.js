import { postData, getTeams, getGames } from "../util/https";
import { Alert } from "react-native";

async function generateGames({
  tournament_name,
  tournamentPhase,
  setGameList,
}) {
  async function groupTeamsByGroup(tournament_name) {
    const teams = await getTeams(tournament_name);
    return teams.reduce((acc, team) => {
      if (!acc[team.group]) {
        acc[team.group] = [];
      }
      acc[team.group].push({
        team: team.teamName,
        id: team.id,
        points: team.statistics.p,
      });
      return acc;
    }, {});
  }

  async function generateGroupStageGames(tournament_name) {
    const groups = await groupTeamsByGroup(tournament_name);
    const games = [];

    Object.keys(groups).forEach((group) => {
      const groupTeams = groups[group];
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          games.push({
            home: groupTeams[i]["team"],
            away: groupTeams[j]["team"],
            date: "TBD",
            time: "TBD",
            id: `${groupTeams[i]["id"]}${groupTeams[j]["id"]}`,
          });
        }
      }
    });

    return games;
  }

  async function generateRoundOf16Games(tournament_name) {
    const groups = await groupTeamsByGroup(tournament_name);
    const sortedGroups = {};

    Object.keys(groups).forEach((group) => {
      sortedGroups[group] = groups[group].sort((a, b) => b.points - a.points);
    });

    const matchups = [
      ["A", "B"],
      ["C", "D"],
      ["E", "F"],
      ["G", "H"],
      ["B", "A"],
      ["D", "C"],
      ["F", "E"],
      ["H", "G"],
    ];

    const games = [];
    matchups.forEach(([group1, group2]) => {
      const team1 = sortedGroups[group1][0];
      const team2 = sortedGroups[group2][1];
      if (team1 && team2) {
        games.push({
          home: team1["team"],
          away: team2["team"],
          date: "TBD",
          time: "TBD",
          id: `${team1["id"]}${team2["id"]}`,
        });
      }
    });
    return games;
  }

  const previous_phases = {
    "Group Stage": null, // No previous stage
    "Round of 16": "Group Stage",
    "Quarter-finals": "Round of 16",
    "Semi-finals": "Quarter-finals",
    Final: "Semi-finals",
  };

  async function validatePreviousPhase(previous_games) {
    const checkScore = previous_games.find(
      (item) => !item.hasOwnProperty("score")
    );
    if (checkScore || previous_games.length == 0) {
      Alert.alert(
        "Games not completed",
        "Please finish all games from previous round before generating new games"
      );
      return false;
    } else {
      return true;
    }
  }

  async function generateMatches(tournament_name, phase) {
    const previous_games = await getGames(
      tournament_name,
      previous_phases[phase]
    );

    const isValid = await validatePreviousPhase(previous_games);
    if (!isValid) {
      return [];
    }
    console.log("PG", previous_games);
    const winners = [];
    const losers = [];

    previous_games.forEach((game) => {
      if (game.score[0] > game.score[1]) {
        winners.push(game.home);
        losers.push(game.away);
      } else {
        winners.push(game.away);
        losers.push(game.home);
      }
    });

    const games = [];

    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        games.push({
          home: winners[i],
          away: winners[i + 1],
          date: "TBD",
          time: "TBD",
          id: i,
        });
      }
    }

    if (phase === "Final") {
      games.push({
        home: losers[0],
        away: losers[1],
        date: "TBD",
        time: "TBD",
        id: 1,
      });
    }
    return games;
  }

  let games = [];

  if (tournamentPhase === "Group Stage") {
    games = await generateGroupStageGames(tournament_name);
  } else if (tournamentPhase === "Round of 16") {
    games = await generateRoundOf16Games(tournament_name);
  } else {
    games = await generateMatches(tournament_name, tournamentPhase);
  }

  console.log(games);
  for (const game of games) {
    await postData(tournament_name, game, `games/${tournamentPhase}`);
  }
  setGameList(games);
}

export default generateGames;
