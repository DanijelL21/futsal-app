// External Libraries
import { createContext, useState } from "react";

export const BasicContext = createContext({
  competitionData: {},
  setCompetitionData: () => {},
  getCompetitionData: () => {},
});

function BasicContextProvider({ children }) {
  const [competitionInfo, setCompetitionInfo] = useState({});

  function setCompetitionData(data) {
    setCompetitionInfo(data);
  }

  function getCompetitionData() {
    return competitionInfo;
  }

  const value = {
    competitionData: competitionInfo,
    setCompetitionData: setCompetitionData,
    getCompetitionData: getCompetitionData,
  };

  return (
    <BasicContext.Provider value={value}>{children}</BasicContext.Provider>
  );
}

export default BasicContextProvider;
