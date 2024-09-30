// In Realtime database

export const BACKEND_URL =
  "https://futsalapp-c67e9-default-rtdb.europe-west1.firebasedatabase.app/";

// Right to the project overview, click settings. In general, there is Web API Key

export const API_KEY = "AIzaSyBHCiMZ-D_Nr3Pqm0oJ6nlY1IAhZ7yqlPM";

// Right to the project overview, click settings. Scroll to SDK setup and configuration and select GoogleService-info.plist
// NOTE: the app must be first created for that

export const firebaseConfig = {
  apiKey: "AIzaSyAeaytbw6TU-THCdpIMutkdYEibZMFPpTk", // API_KEY in plist
  authDomain: "futsal-app-775db.firebaseapp.com", // Derived from PROJECT_ID + just add .firebaseapp.com
  databaseURL:
    "https://futsalapp-c67e9-default-rtdb.europe-west1.firebasedatabase.app", // DATABASE_URL in plist
  projectId: "futsalapp-c67e9", // PROJECT_ID in plist
  storageBucket: "futsalapp-c67e9.appspot.com", // STORAGE_BUCKET in plist
  messagingSenderId: "827666757676", // GCM_SENDER_ID in plist
  appId: "1:827666757676:ios:8b15d9dfa72586cd7cb989", // GOOGLE_APP_ID in plist
};

// old
// export const firebaseConfig = {
//   apiKey: "AIzaSyDD5eniiE4LvqyTta02L8KFuNJ0sQysjwA", // API_KEY in plist
//   authDomain: "futsal-app-775db.firebaseapp.com", // Derived from PROJECT_ID + just add .firebaseapp.com
//   databaseURL:
//     "https://futsal-app-775db-default-rtdb.europe-west1.firebasedatabase.app", // DATABASE_URL in plist
//   projectId: "futsal-app-775db", // PROJECT_ID in plist
//   storageBucket: "futsal-app-775db.appspot.com", // STORAGE_BUCKET in plist
//   messagingSenderId: "931726091731", // GCM_SENDER_ID in plist
//   appId: "1:931726091731:ios:69c08d5b878529b7dd3b26", // GOOGLE_APP_ID in plist
// };
