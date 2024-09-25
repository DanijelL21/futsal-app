import { getData } from "../util/https";
import { addFirebaseKey } from "./commonTranforms";

async function idGenerator(tournamentName, tournamentPhase = null) {
  console.log("IDGENERATOR");
  const endpoint = tournamentPhase ? `games/${tournamentPhase}` : "/teams";
  const data = await getData(tournamentName, endpoint);

  if (data && Object.keys(data).length > 0) {
    const info = addFirebaseKey(data);
    console.log("DATA", data);
    console.log("INFO", info);

    const ids = Object.values(info).map((item) => item.id);
    const maxId = Math.max(...ids);

    return (maxId + 1).toString();
  } else {
    return "1";
  }
}

export default idGenerator;
