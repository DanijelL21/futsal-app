// External Libraries
import axios from "axios";
import { Alert } from "react-native";

import { BACKEND_URL } from "../firebaseConfig";

const MAX_RETRIES = 3;

async function retryRequest(requestFunc, retries = MAX_RETRIES) {
  try {
    return await requestFunc();
  } catch (error) {
    if (retries > 0) {
      return await retryRequest(requestFunc, retries - 1);
    } else {
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again later.",
        [{ text: "OK" }]
      );
      return [];
    }
  }
}

export async function getTournaments(tournamentName = null) {
  const endpoint = tournamentName
    ? `/tournaments/${tournamentName}.json`
    : "/tournaments.json";

  const requestFunc = async () => {
    const response = await axios.get(BACKEND_URL + endpoint);
    const data = response.data;
    return data ? (tournamentName ? data : Object.values(data)) : [];
  };

  return await retryRequest(requestFunc);
}

export async function postData(tournamentName, data, key = null) {
  console.log("Trying to put in https", key);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  const postPath =
    key !== null ? `${REQUEST_URL}/${key}.json` : `${REQUEST_URL}.json`;

  const requestFunc = async () => {
    return await axios.post(postPath, data);
  };

  return await retryRequest(requestFunc);
}

export async function updateData(tournamentName, data, key, id) {
  console.log("Trying to update data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  const requestFunc = async () => {
    return await axios.patch(`${REQUEST_URL}/${key}/${id}.json`, data);
  };

  return await retryRequest(requestFunc);
}

export async function deleteData(tournamentName, key, id = null) {
  console.log("Trying to delete data in https", key, id);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  const deletePath =
    id !== null
      ? `${REQUEST_URL}/${key}/${id}.json`
      : `${REQUEST_URL}/${key}.json`;

  const requestFunc = async () => {
    return await axios.delete(deletePath);
  };

  return await retryRequest(requestFunc);
}

export async function getData(tournamentName, key) {
  console.log("Trying to get data in https", key);
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;

  const requestFunc = async () => {
    const response = await axios.get(`${REQUEST_URL}/${key}.json`);
    return response.data;
  };

  return await retryRequest(requestFunc);
}
