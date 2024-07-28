// External Libraries
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Internal Modules
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
