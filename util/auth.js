import axios from "axios";
import { Alert } from "react-native";

const API_KEY = "AIzaSyC9acsS8HUNpGuTnjTultHiQzPPRGDPnlE";

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
    console.log(error);
    Alert.alert(
      "Authentication failed!",
      "Could not log you in. Please check your credentials or try again later!"
    );
    return "";
  }
}
