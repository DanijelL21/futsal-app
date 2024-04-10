function makeBackendData(homeGoals, awayGoals, time) {
  const data = {
    homeGoals: homeGoals,
    awayGoals: awayGoals,
    time: time,
  };
  return data;
}

export default makeBackendData;
