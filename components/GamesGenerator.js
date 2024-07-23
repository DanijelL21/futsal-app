import { postData, getTeams, getGames } from "../util/https";
import { Alert } from "react-native";

const PHASES = {
  GROUP_STAGE: "Group Stage",
  ROUND_OF_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals",
  SEMI_FINALS: "Semi-finals",
  FINAL: "Final",
};

const PREVIOUS_PHASES = {
  [PHASES.GROUP_STAGE]: null,
  [PHASES.ROUND_OF_16]: PHASES.GROUP_STAGE,
  [PHASES.QUARTER_FINALS]: PHASES.ROUND_OF_16,
  [PHASES.SEMI_FINALS]: PHASES.QUARTER_FINALS,
  [PHASES.FINAL]: PHASES.SEMI_FINALS,
};

const MATCHUPS = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["B", "A"],
  ["D", "C"],
  ["F", "E"],
  ["H", "G"],
];

async function groupTeamsByGroup(tournamentName) {
  const teams = await getTeams(tournamentName);
  return teams.reduce((acc, team) => {
    if (!acc[team.group]) acc[team.group] = [];
    acc[team.group].push({
      team: team.teamName,
      id: team.id,
      points: team.statistics.p,
    });
    return acc;
  }, {});
}

async function generateGroupStageGames(tournamentName) {
  const groups = await groupTeamsByGroup(tournamentName);
  const games = [];

  Object.values(groups).forEach((groupTeams) => {
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        games.push({
          home: groupTeams[i].team,
          away: groupTeams[j].team,
          date: "TBD",
          time: "TBD",
          id: `${groupTeams[i].id}${groupTeams[j].id}`,
        });
      }
    }
  });

  return games;
}

async function generateRoundOf16Games(tournamentName) {
  const groups = await groupTeamsByGroup(tournamentName);

  if (
    !Object.values(groups).every(
      (group) => group.filter((team) => team.points > 0).length >= 2
    )
  ) {
    Alert.alert(
      "Games not completed",
      "Please finish all games from previous round before generating new games"
    );
    return [];
  }

  const sortedGroups = Object.fromEntries(
    Object.entries(groups).map(([group, teams]) => [
      group,
      teams.sort((a, b) => b.points - a.points),
    ])
  );

  return MATCHUPS.map(([group1, group2]) => {
    const team1 = sortedGroups[group1]?.[0];
    const team2 = sortedGroups[group2]?.[1];
    return team1 && team2
      ? {
          home: team1.team,
          away: team2.team,
          date: "TBD",
          time: "TBD",
          id: `${team1.id}${team2.id}`,
        }
      : null;
  }).filter(Boolean);
}

async function generateOtherMatches(tournamentName, phase) {
  const previousGames = await getGames(tournamentName, PREVIOUS_PHASES[phase]);

  if (!previousGames.length || previousGames.some((game) => !game.score)) {
    Alert.alert(
      "Games not completed",
      "Please finish all games from previous round before generating new games"
    );
    return [];
  }
  const [winners, losers] = previousGames.reduce(
    ([win, lose], game) => {
      const [homeScore, awayScore] = game.score;
      if (homeScore > awayScore) {
        win.push(game.home);
        lose.push(game.away);
      } else {
        win.push(game.away);
        lose.push(game.home);
      }
      return [win, lose];
    },
    [[], []]
  );

  const games = winners.reduce((acc, team, index, arr) => {
    if (index % 2 === 0 && arr[index + 1]) {
      acc.push({
        home: team,
        away: arr[index + 1],
        date: "TBD",
        time: "TBD",
        id: index / 2,
      });
    }
    return acc;
  }, []);

  if (phase === PHASES.FINAL && losers.length >= 2) {
    games.push({
      home: losers[0],
      away: losers[1],
      date: "TBD",
      time: "TBD",
      id: games.length,
    });
  }

  return games;
}

async function generateGames({ tournamentName, tournamentPhase, setGameList }) {
  let games = [];
  try {
    if (tournamentPhase === PHASES.GROUP_STAGE) {
      games = await generateGroupStageGames(tournamentName);
    } else if (tournamentPhase === PHASES.ROUND_OF_16) {
      games = await generateRoundOf16Games(tournamentName);
    } else {
      games = await generateOtherMatches(tournamentName, tournamentPhase);
    }

    for (const game of games) {
      await postData(tournamentName, game, `games/${tournamentPhase}`);
    }
    setGameList(games);
  } catch (error) {
    console.error("Error generating games:", error);
    Alert.alert(
      "Error",
      "There was an error generating the games. Please try again."
    );
  }
}

export default generateGames;
