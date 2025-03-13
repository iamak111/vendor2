import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage, ref } from "firebase/storage";

// Initialize Firebase
// const firebaseConfig = {
//   apiKey: process.env.F_API_KEY,
//   authDomain: process.env.F_AUTH_DOMIN,
//   projectId: process.env.F_PROJECT_ID,
//   storageBucket: process.env.F_STORAGE_BUCKET,
//   messagingSenderId: process.env.F_MESSAGING_SENDER_ID,
//   appId: process.env.F_APP_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyD2FOSesXjxfUNR_U3QEeGlIqwJDccEZIs",
  authDomain: "ctemp-c5403.firebaseapp.com",
  projectId: "ctemp-c5403",
  storageBucket: "ctemp-c5403.appspot.com",
  messagingSenderId: "1028200400728",
  appId: "1:1028200400728:web:1ea9f67e4348b7ac95872d",
};
const FirebaseApp = initializeApp(firebaseConfig);
// const storage = getStorage(FirebaseApp);

export { FirebaseApp };
