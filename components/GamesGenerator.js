// External Libraries
import { Alert } from "react-native";
// Internal Modules
import { postData, getData } from "../util/https";
import { addFirebaseKey } from "./commonTranforms";
import generateTables from "./TablesGenerator";

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

async function groupTeamsByGroup(tournamentName) {
  const data = await getData(tournamentName, "teams");
  const teams = addFirebaseKey(data);

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

async function generateSecondRound(tournamentName, tournamentPhase) {
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

  const tables = await generateTables(tournamentName);
  const firstRoundMatches = [];
  const secondRoundMatches = [];

  const createMatch = (homeTeam, awayTeam) => {
    return {
      home: homeTeam.name,
      away: awayTeam.name,
      date: "TBD",
      time: "TBD",
      id: `${homeTeam.name}${awayTeam.name}`,
    };
  };

  for (let i = 0; i < tables.length; i += 2) {
    const group1 = tables[i];
    const group2 = tables[i + 1];

    if (group1 && group2) {
      firstRoundMatches.push(createMatch(group1.teams[0], group2.teams[1]));
      secondRoundMatches.push(createMatch(group2.teams[0], group1.teams[1]));
    }
  }

  const games = [...firstRoundMatches, ...secondRoundMatches];

  return games;
}

async function generateOtherMatches(tournamentName, phase) {
  const data = await getData(tournamentName, `games/${PREVIOUS_PHASES[phase]}`);
  const previousGames = addFirebaseKey(data);

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
        matchType: phase === "Final" ? "Final" : null,
        id: index / 2,
      });
    }
    return acc;
  }, []);

  // third place
  if (phase === PHASES.FINAL && losers.length >= 2) {
    games.push({
      home: losers[0],
      away: losers[1],
      date: "TBD",
      time: "TBD",
      matchType: "Third-place",
      id: games.length,
    });
  }

  return games;
}

async function generateGames({
  tournamentName,
  tournamentPhase,
  teamsNr,
  setGameList,
}) {
  if (teamsNr !== 16 && teamsNr !== 24) {
    setGameList([]);
    Alert.alert(
      "Not supported",
      "This feature is only supported for tournaments with 16 or 24 teams."
    );
  } else {
    let games = [];
    try {
      if (tournamentPhase === PHASES.GROUP_STAGE) {
        games = await generateGroupStageGames(tournamentName);
      } else if (tournamentPhase === PHASES.ROUND_OF_16) {
        console.log("TEST");
        games = await generateSecondRound(tournamentName, tournamentPhase);
      } else if (tournamentPhase === PHASES.QUARTER_FINALS && teamsNr == 16) {
        games = await generateSecondRound(tournamentName, tournamentPhase);
      } else {
        games = await generateOtherMatches(tournamentName, tournamentPhase);
      }

      for (const game of games) {
        await postData(tournamentName, game, `games/${tournamentPhase}`);
      }
      setGameList(games);
    } catch (error) {
      setGameList([]);
      console.log("ERROR", error);
      Alert.alert(
        "Error",
        "There was an error generating the games. Please try again."
      );
    }
  }
}

export default generateGames;
