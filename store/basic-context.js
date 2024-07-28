// External Libraries
import { createContext, useState } from "react";

export const BasicContext = createContext({
  tournamentData: {},
  setTournamentData: () => {},
  getTournamentData: () => {},
});

function BasicContextProvider({ children }) {
  const [tournamentInfo, setTournamentInfo] = useState({});

  function setTournamentData(data) {
    console.log("SETTING DATA", data);
    setTournamentInfo(data);
  }

  function getTournamentData() {
    return tournamentInfo;
  }

  const value = {
    tournamentData: tournamentInfo,
    setTournamentData: setTournamentData,
    getTournamentData: getTournamentData,
  };

  return (
    <BasicContext.Provider value={value}>{children}</BasicContext.Provider>
  );
}

export default BasicContextProvider;
