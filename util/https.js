import axios from "axios";
// for now we suppose that user created torunament

const BACKEND_URL =
  "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/";

export async function getTournaments() {
  console.log("GETTING TOURNAMENTS");
  try {
    const response = await axios.get(BACKEND_URL + "/tournaments.json");
    const data = Object.values(response.data);
    return data;
  } catch (error) {
    console.error("Error getting tournaments:", error);
  }
}

export async function getAdmin(tournament_name) {
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
  const response = await axios.get(REQUEST_URL + "/adminMail.json");
  return response.data;
}

export async function postData(tournament_name, data, key = null) {
  console.log("Trying to put in https", key);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
  if (key !== null) {
    post_path = `${REQUEST_URL}/${key}.json`;
  } else {
    post_path = `${REQUEST_URL}.json`;
  }
  const response = await axios.post(post_path, data);
  return response;
}

export async function updateData(tournament_name, data, key, id) {
  console.log("Trying to update data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
  return axios.put(REQUEST_URL + `/${key}/${id}.json`, data);
}

export function deleteData(tournament_name, id, key) {
  console.log("Trying to delete data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
  return axios.delete(REQUEST_URL + `/${key}/${id}.json`);
}

// REMOVE type, this was bad try
export async function getTeamDetails(tournament_name, firebaseKey) {
  console.log("Trying to fetch data", `/teams/${firebaseKey}.json`);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
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
export async function getMatchEvents(tournament_name, firebaseKey) {
  console.log("Trying to fetch events", `/events/${firebaseKey}.json`);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
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

export async function getTeams(tournament_name) {
  console.log("Trying to fetch teams in https");
  console.log(tournament_name);
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
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

export async function getGames(tournament_name) {
  console.log("Trying to fetch games in https");
  const REQUEST_URL = `${BACKEND_URL}${tournament_name}`;
  try {
    const response = await axios.get(REQUEST_URL + "/games.json");
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
