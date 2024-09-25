// External Libraries
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Internal Modules
import { firebaseConfig } from "../secrets/firebaseConfig";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
