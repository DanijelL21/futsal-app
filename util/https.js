// External Libraries
import axios from "axios";
import { Alert } from "react-native";

import { BACKEND_URL } from "../secrets/firebaseConfig";

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

export async function getCompetition(mode, competitionName = null) {
  // mode should be tournaments
  const endpoint = competitionName
    ? `/${mode}/${competitionName}.json`
    : `/${mode}.json`;

  const requestFunc = async () => {
    const response = await axios.get(BACKEND_URL + endpoint);
    const data = response.data;
    return data ? (competitionName ? data : Object.values(data)) : [];
  };

  return await retryRequest(requestFunc);
}

export async function postData(tournamentName, data, key = null) {
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;
  const postPath =
    key !== null ? `${REQUEST_URL}/${key}.json` : `${REQUEST_URL}.json`;

  const requestFunc = async () => {
    return await axios.post(postPath, data);
  };

  return await retryRequest(requestFunc);
}

export async function updateData(competitionName, data, key) {
  const REQUEST_URL = `${BACKEND_URL}${competitionName}`;
  const requestFunc = async () => {
    return await axios.patch(`${REQUEST_URL}/${key}.json`, data);
  };

  return await retryRequest(requestFunc);
}

export async function deleteData(tournamentName, key, id = null) {
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
  const REQUEST_URL = `${BACKEND_URL}${tournamentName}`;

  const requestFunc = async () => {
    const response = await axios.get(`${REQUEST_URL}/${key}.json`);
    return response.data;
  };

  return await retryRequest(requestFunc);
}

export async function getNews() {
  const requestFunc = async () => {
    const response = await axios.get(`${BACKEND_URL}/news.json`);
    return response.data;
  };

  return await retryRequest(requestFunc);
}
