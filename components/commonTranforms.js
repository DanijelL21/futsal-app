export function addFirebaseKey(data) {
  if (!data || Object.keys(data).length === 0) {
    return [];
  }
  const transformedData = Object.entries(data).map(([firebaseKey, team]) => {
    return { ...team, firebaseKey };
  });
  return transformedData;
}

export function sortGamesByDateAndTime(games) {
  return games.sort((a, b) => {
    if (!a.date || !b.date || !a.time || !b.time) {
      console.error("Invalid game data detected A", a);
      console.error("Invalid game data detected B", b);
      return 0;
    }

    // Parse dates
    const [dayA, monthA, yearA] = a.date.split(".").map(Number);
    const [dayB, monthB, yearB] = b.date.split(".").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    // Parse times
    const [hourA, minuteA] = a.time.split(":").map(Number);
    const [hourB, minuteB] = b.time.split(":").map(Number);
    const timeA = new Date(0, 0, 0, hourA, minuteA);
    const timeB = new Date(0, 0, 0, hourB, minuteB);

    return timeA.getTime() - timeB.getTime();
  });
}
