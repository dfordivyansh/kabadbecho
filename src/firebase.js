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

// 🚀 MULTIPLE APP INSTANCES (IMPORTANT)
const customerApp = initializeApp(firebaseConfig, "customerApp");
const partnerApp = initializeApp(firebaseConfig, "partnerApp");
const adminApp = initializeApp(firebaseConfig, "adminApp");

// 🔥 Firestore (single instance enough)
const db = getFirestore(customerApp);

// 🔥 Separate Auth Instances
const customerAuth = getAuth(customerApp);
const partnerAuth = getAuth(partnerApp);
const adminAuth = getAuth(adminApp);

// 🔥 Google Provider
const googleProvider = new GoogleAuthProvider();

// 🌐 Optional (safe)
let analytics = null;
let messaging = null;

if (typeof window !== "undefined") {
  // Analytics
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(customerApp);
  });

  // Messaging
  try {
    messaging = getMessaging(customerApp);
  } catch (e) {
    console.warn("Messaging init failed:", e);
  }
}

// 📦 EXPORT
export {
  db,
  customerAuth,
  partnerAuth,
  adminAuth,
  googleProvider,
  analytics,
  messaging
};