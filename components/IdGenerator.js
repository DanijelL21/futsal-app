import { getData } from "../util/https";
import { addFirebaseKey } from "./commonTranforms";

async function idGenerator(competitionName, competitionPhase = null) {
  const endpoint = competitionPhase ? `games/${competitionPhase}` : "/teams";
  const data = await getData(competitionName, endpoint);

  if (data && Object.keys(data).length > 0) {
    const info = addFirebaseKey(data);

    const ids = Object.values(info).map((item) => item.id);
    const maxId = Math.max(...ids);

    return (maxId + 1).toString();
  } else {
    return "1";
  }
}

export default idGenerator;
