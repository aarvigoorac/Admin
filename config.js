import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-WnYAD7uJHGv0AENBNqvGaYZ-2G9ABCU",
  authDomain: "aarvi-stores.firebaseapp.com",
  projectId: "aarvi-stores",
  storageBucket: "aarvi-stores.firebasestorage.app",
  messagingSenderId: "291036265133",
  appId: "1:291036265133:web:eebb9b400afa6ce664a424",
  measurementId: "G-YEPJK3WBDS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
