// External Libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: (token) => {},
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState({});

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setAuthToken(JSON.parse(storedToken));
      }
    }
    fetchToken();
  }, []);

  function authenticate(token) {
    // trigger this when user login succesfully
    setAuthToken(token);
    AsyncStorage.setItem("token", JSON.stringify(token));
  }

  function logout() {
    console.log("LOGOUT");
    setAuthToken(null);
    AsyncStorage.removeItem("token");
  }

  function isAuthenticated(tournamentName) {
    if (
      authToken &&
      Object.keys(authToken).length > 0 &&
      authToken.token !== "" &&
      authToken.tournamentName === tournamentName
    ) {
      return true;
    } else {
      return false;
    }
  }

  const value = {
    token: authToken,
    isAuthenticated: isAuthenticated,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
