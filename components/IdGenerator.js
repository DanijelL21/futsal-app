import { getGames } from "../util/https";

async function idGenerator(tournamentName, phase) {
  const games = await getGames(tournamentName, phase);
  const ids = Object.values(games).map((item) => item.id);
  const maxId = Math.max(...ids);
  console.log("next id", maxId + 1);
  return (maxId + 1).toString(); // Ensure the ID is returned as a string
}

export default idGenerator;
