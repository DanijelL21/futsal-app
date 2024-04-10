import axios from "axios";

// for now we suppose that user created torunament

const BACKEND_URL =
  "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app/";

const TOURNAMENT_NAME = "mnt_test";

const REQUEST_URL = `${BACKEND_URL}${TOURNAMENT_NAME}`;

export async function getMatchData() {
  const response = await axios.get(REQUEST_URL);

  const dataKeys = Object.keys(response.data);
  console.log(dataKeys);

  const lastElementKey = dataKeys[dataKeys.length - 1];
  console.log(lastElementKey);

  const lastElement = response.data[lastElementKey];
  console.log(lastElement);

  return lastElement;
}

export async function postData(data, key = null) {
  console.log("Trying to put", key);
  if (key !== null) {
    post_path = REQUEST_URL + "/" + key + ".json";
  } else {
    post_path = REQUEST_URL + ".json";
  }
  const response = await axios.post(post_path, data);
}

export async function updateData(data, key, id) {
  console.log("Trying to update team", key, id);
  return axios.put(REQUEST_URL + `/${key}/${id}.json`, data);
}

export function deleteData(id, key) {
  console.log("Trying to delete team", id);
  return axios.delete(REQUEST_URL + `/${key}/${id}.json`);
}

export async function getTeams() {
  console.log("Trying to fetch teams");
  try {
    const response = await axios.get(REQUEST_URL + "/teams.json");
    if (!response.data || Object.keys(response.data).length === 0) {
      return [];
    }
    const teams = Object.entries(response.data).map(([firebaseKey, team]) => {
      return { ...team, firebaseKey }; // Adding firebaseKey to each team object
    });
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

export async function getTeamDetails(id) {
  console.log("Trying to fetch team", id);
  try {
    const response = await axios.get(REQUEST_URL + `/teams/${id}.json`);
    const data = response.data;
    data.firebaseKey = id;
    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}
// THIS CAN MAYBE BE THE SAME FUNCTION AS ABOVE
// WE NEED TO BE ABLE TO UPDATE THIS, SO FOR NOW THIS IS SEPARATE FUNCTION
export async function getGames() {
  console.log("Trying to fetch teams");
  try {
    const response = await axios.get(REQUEST_URL + "/games.json");
    if (!response.data || Object.keys(response.data).length === 0) {
      return [];
    }
    const teams = Object.entries(response.data).map(([firebaseKey, team]) => {
      return { ...team, firebaseKey }; // Adding firebaseKey to each team object
    });
    return teams;
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}
