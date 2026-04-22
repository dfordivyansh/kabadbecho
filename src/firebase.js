// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAnalytics, isSupported } from "firebase/analytics";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB31LFBAHo3Br3Hvih-8xmH7jMnr6BP2WQ",
  authDomain: "scraplink-e4121.firebaseapp.com",
  projectId: "scraplink-e4121",
  messagingSenderId: "416158070492",
  appId: "1:416158070492:web:6052f93175428bacbea619",
  measurementId: "G-KXWBN0C74T"
};

// 🚀 Init
const app = initializeApp(firebaseConfig);

// 🔥 Core
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🌐 Optional (safe)
let analytics = null;
let messaging = null;

if (typeof window !== "undefined") {
  // Analytics safe init
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });

  // Messaging safe init
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Messaging init failed:", e);
  }
}

// 📦 Export
export {
  app,
  db,
  auth,
  googleProvider,
  analytics,
  messaging
};