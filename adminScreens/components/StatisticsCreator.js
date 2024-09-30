function GenerateTeamStatistics(
  updatedHomeTeam,
  updatedAwayTeam,
  eventsList,
  competitionPhase,
  mode,
  score
) {
  console.log("FIRST HOME TEAM", JSON.stringify(updatedHomeTeam, null, 2));
  eventsList.forEach((event) => {
    const { event: eventType, player, assist, team } = event;
    let teamData = team === "home" ? updatedHomeTeam : updatedAwayTeam;

    const playerData = teamData.players.find((p) => p.name === player);

    if (playerData) {
      switch (eventType) {
        case "goal":
          playerData.stats.goals = (playerData.stats.goals || 0) + 1;
          break;
        case "assist":
          playerData.stats.assists = (playerData.stats.assists || 0) + 1;
          break;
        case "redCard":
          playerData.stats.rc = (playerData.stats.rc || 0) + 1;
          break;
        case "yellowCard":
          playerData.stats.yc = (playerData.stats.yc || 0) + 1;
          break;
        default:
          break;
      }
    }

    if (eventType === "goal" && assist && assist !== "NONE") {
      const assistPlayerData = teamData.players.find((p) => p.name === assist);
      if (assistPlayerData) {
        assistPlayerData.stats.assists =
          (assistPlayerData.stats.assists || 0) + 1;
      }
    }
  });
  console.log("Updated Home Team", JSON.stringify(updatedHomeTeam, null, 2));

  // Update team statistics if in Group Stage
  if (competitionPhase === "Group Stage" || mode === "leagues") {
    const [homeScore, awayScore] = score;

    // Update home team statistics
    updatedHomeTeam.statistics.pg += 1;
    updatedHomeTeam.statistics.w += homeScore > awayScore ? 1 : 0;
    updatedHomeTeam.statistics.l += awayScore > homeScore ? 1 : 0;
    updatedHomeTeam.statistics.d += homeScore === awayScore ? 1 : 0;
    updatedHomeTeam.statistics.g[0] += homeScore;
    updatedHomeTeam.statistics.g[1] += awayScore;
    updatedHomeTeam.statistics.gd += homeScore - awayScore;

    // Update away team statistics
    updatedAwayTeam.statistics.pg += 1;
    updatedAwayTeam.statistics.w += awayScore > homeScore ? 1 : 0;
    updatedAwayTeam.statistics.l += homeScore > awayScore ? 1 : 0;
    updatedAwayTeam.statistics.d += homeScore === awayScore ? 1 : 0;
    updatedAwayTeam.statistics.g[0] += awayScore;
    updatedAwayTeam.statistics.g[1] += homeScore;
    updatedAwayTeam.statistics.gd += awayScore - homeScore;

    // Update points
    updatedHomeTeam.statistics.p +=
      homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0;
    updatedAwayTeam.statistics.p +=
      awayScore > homeScore ? 3 : homeScore === awayScore ? 1 : 0;
  }

  return { updatedHomeTeam, updatedAwayTeam };
}

export default GenerateTeamStatistics;
