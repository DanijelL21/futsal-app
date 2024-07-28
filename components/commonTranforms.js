export function addFirebaseKey(data) {
  if (!data || Object.keys(data).length === 0) {
    return [];
  }
  const transformedData = Object.entries(data).map(([firebaseKey, team]) => {
    return { ...team, firebaseKey };
  });
  return transformedData;
}
