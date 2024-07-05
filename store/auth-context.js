import AsyncStorage from "@react-native-async-storage/async-storage"; // https://react-native-async-storage.github.io/async-storage/docs/install/

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
    // console.log("TOKEN", token);
    AsyncStorage.setItem("token", JSON.stringify(token));
    console.log("SUCCESFULLY SET ITEM", token);
  }

  function logout() {
    console.log("LOGOUT");
    setAuthToken(null);
    AsyncStorage.removeItem("token");
  }

  function isAuthenticated(tournament_name) {
    console.log("AUTH TOKEN IN", authToken);
    console.log("TN", tournament_name);

    if (
      authToken &&
      Object.keys(authToken).length > 0 &&
      authToken.token !== "" &&
      authToken.tournament_name === tournament_name
    ) {
      console.log(authToken.tournament_name);
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
