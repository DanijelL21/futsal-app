export function validateGameDataInput(gameData) {
  isValid = false;
  if (gameData.home.length < 2 || gameData.away.length < 2) {
    message = `Team name should have minimum of 2 letters`;
  } else if (
    gameData.date.length !== 10 ||
    gameData.date.split(".").length - 1 !== 2 // contains two .
  ) {
    message = "Date must be in form of DD.MM.YYYY";
  } else if (
    gameData.time.length !== 5 ||
    gameData.time.split(":").length - 1 !== 1 || // contains one :
    isNaN(parseInt(gameData.time.split(":")[0])) ||
    isNaN(parseInt(gameData.time.split(":")[1])) ||
    parseInt(gameData.time.split(":")[0]) < 0 ||
    parseInt(gameData.time.split(":")[0]) > 23 ||
    parseInt(gameData.time.split(":")[1]) < 0 ||
    parseInt(gameData.time.split(":")[1]) > 59
  ) {
    message = "Time must be in form of HH:MM";
  } else {
    const [day, month, year] = gameData.date.split(".");
    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      parseInt(day) < 1 ||
      parseInt(day) > 31 ||
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(year) < 1000 ||
      parseInt(year) > 9999
    ) {
      message = "Invalid date";
    } else {
      isValid = true;
      message = "";
    }
  }

  return { isValid: isValid, message: message };
}
