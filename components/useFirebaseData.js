// External Libraries
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";

// Internal Modules
import { database } from "../util/firebaseUtil";

// Custom hook to fetch data from a Firebase path
export function useFirebaseData(path) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, path);

    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      setData(data);
    };

    // Attach the listener
    const unsubscribe = onValue(dataRef, onDataChange);

    // Clean up the listener when the component unmounts
    return () => {
      off(dataRef, "value", onDataChange);
      unsubscribe();
    };
  }, [path]);

  return data;
}
