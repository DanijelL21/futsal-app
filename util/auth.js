// External Libraries
import axios from "axios";
import { Alert } from "react-native";
import { API_KEY } from "../secrets/firebaseConfig";

export async function login(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    const token = response.data.idToken;
    return token;
  } catch (error) {
    Alert.alert(
      "Authentication failed!",
      "Could not log you in. Please check your credentials or try again later!"
    );
    return "";
  }
}
