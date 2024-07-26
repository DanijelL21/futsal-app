import axios from "axios";

const BACKEND_URL =
  "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/";

export async function getTournaments(tournamentName = null) {
  try {
    const endpoint = tournamentName
      ? `/tournaments/${tournamentName}.json`
      : "/tournaments.json";

    const response = await axios.get(BACKEND_URL + endpoint);
    const data = response.data;

    return data ? (tournamentName ? data : Object.values(data)) : [];
  } catch (error) {
    console.error("Error getting tournaments:", error);
    return [];
  }
}

export async function postData(tournamentName, data, key = null) {
  console.log("Trying to put in https", key);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  if (key !== null) {
    post_path = `${REQUEST_URL}/${key}.json`;
  } else {
    post_path = `${REQUEST_URL}.json`;
  }
  const response = await axios.post(post_path, data);
  return response;
}

export async function updateData(tournamentName, data, key, id) {
  console.log("Trying to update data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  return axios.patch(REQUEST_URL + `/${key}/${id}.json`, data);
}

export function deleteData(tournamentName, key, id = null) {
  console.log("Trying to delete data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  if (id !== null) {
    axios.delete(REQUEST_URL + `/${key}/${id}.json`);
  } else {
    axios.delete(REQUEST_URL + `/${key}.json`);
  }
}

export async function getData(tournamentName, key) {
  console.log("Trying to get data in https", key);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(REQUEST_URL + `/${key}.json`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// REMOVE type, this was bad try
export async function getTeamDetails(tournamentName, firebaseKey) {
  console.log("Trying to fetch data", `/teams/${firebaseKey}.json`);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(
      REQUEST_URL + `/teams/${firebaseKey}.json`
    );

    const data = response.data;
    data.players = data.players.filter((player) => player.name !== "");
    data.firebaseKey = firebaseKey;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// if I won't use this multiple times, move this transform logic
export async function getMatchEvents(tournamentName, firebaseKey) {
  console.log("Trying to fetch events", `/events/${firebaseKey}.json`);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(
      REQUEST_URL + `/events/${firebaseKey}.json`
    );

    const data = response.data;

    const events = [];
    let time = null;

    if (data == null) {
      return { events, time };
    } else {
      Object.keys(data).forEach((key) => {
        if (key !== "time") {
          const eventObject = {
            eventKey: key,
            firebaseKey: firebaseKey,
            ...data[key],
          };
          events.push(eventObject);
        } else {
          const timeKeys = Object.keys(data[key]);
          if (timeKeys.length > 0) {
            time = data[key][timeKeys[timeKeys.length - 1]].time;
          }
        }
      });
      return { events, time };
    }
  } catch (error) {
    console.error("Error fetching events in https:", error);
  }
}

export async function getTeams(tournamentName) {
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(REQUEST_URL + "/teams.json");
    if (!response.data || Object.keys(response.data).length === 0) {
      return [];
    }
    const teams = Object.entries(response.data).map(([firebaseKey, team]) => {
      return { ...team, firebaseKey };
    });
    return teams;
  } catch (error) {
    console.error("Error fetching teams in https:", error);
  }
}

export async function getGames(tournamentName, phase) {
  console.log("Trying to fetch games in https");
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(REQUEST_URL + `/games/${phase}.json`);
    if (!response.data || Object.keys(response.data).length === 0) {
      return [];
    }
    const teams = Object.entries(response.data).map(([firebaseKey, team]) => {
      return { ...team, firebaseKey };
    });
    return teams;
  } catch (error) {
    console.error("Error fetching games in https:", error);
  }
}

// this should be combined with some other function
export async function getGame(tournamentName, phase, firebaseKey) {
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  try {
    const response = await axios.get(
      REQUEST_URL + `/games/${phase}/${firebaseKey}.json`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
