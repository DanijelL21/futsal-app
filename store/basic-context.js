import AsyncStorage from "@react-native-async-storage/async-storage"; // https://react-native-async-storage.github.io/async-storage/docs/install/

import { createContext, useEffect, useState } from "react";

export const BasicContext = createContext({
  name: "",
  setTournamentName: () => {},
  getTournamentName: () => {},
});

function BasicContextProvider({ children }) {
  const [name, setName] = useState();

  function setTournamentName(name) {
    setName(name);
    console.log("SET T NAME", name);
  }

  function getTournamentName() {
    console.log("GET NAME", name);
    return name;
  }

  const value = {
    name: name,
    setTournamentName: setTournamentName,
    getTournamentName: getTournamentName,
  };

  return (
    <BasicContext.Provider value={value}>{children}</BasicContext.Provider>
  );
}

export default BasicContextProvider;
