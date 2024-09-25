export function validateGameDataInput(gameData) {
  isValid = false;
  if (gameData.home.length < 2 || gameData.away.length < 2) {
    message = `Please select home and away team`;
  } else {
    isValid = true;
    message = "";
  }

  return { isValid: isValid, message: message };
}

const validatePlayersNumber = (players) => {
  const noNumbers = /^[a-zA-Z\s]+$/;
  const filteredPlayers = players.filter((player) => player.name !== "");

  const areNamesValid = filteredPlayers.every((player) =>
    noNumbers.test(player.name)
  );
  const numbers = filteredPlayers.map((player) => player.number);
  const uniqueNumbers = new Set(numbers);
  const areNumbersValid = numbers.every(
    (number) => !isNaN(number) && number !== ""
  );

  return (
    numbers.length === uniqueNumbers.size && areNumbersValid && areNamesValid
  );
};

export function validateTeamDataInput(teamData) {
  console.log("TEAM DATA", teamData);
  let isValid = false;
  const noNumbers = /^[a-zA-Z\s]+$/;
  let message = "";

  if (teamData.teamName.length < 2) {
    message = `Team name should have a minimum of 2 letters.`;
  } else if (!noNumbers.test(teamData.teamName)) {
    message = `Team name should not contain numbers or special characters.`;
  } else if (!noNumbers.test(teamData.manager)) {
    message = `Manager name should not contain numbers or special characters.`;
  } else if (
    teamData.group !== "TBD" &&
    (teamData.group.length !== 1 || !"ABCDEFGH".includes(teamData.group))
  ) {
    message = `Group should be a single letter between A and H, or "TBD".`;
  } else if (!validatePlayersNumber(teamData.players)) {
    message = `Each player must have a valid name without numbers, and a unique number that is not empty or invalid.`;
  } else {
    isValid = true;
    message = "";
  }

  return { isValid: isValid, message: message };
}
