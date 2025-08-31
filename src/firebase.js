// Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   // ✅ ye add karo
import { getFirestore } from "firebase/firestore";  // agar Firestore use kar rahe ho
import { getStorage } from "firebase/storage";      // agar Storage bhi use karni ho

const firebaseConfig = {
  apiKey: "AIzaSyAJjWCz5-BHOPC8wNki0giXbEXiVwHvULc",
  authDomain: "speedgoapp-2b812.firebaseapp.com",
  projectId: "speedgoapp-2b812",
  storageBucket: "speedgoapp-2b812.firebasestorage.app",
  messagingSenderId: "168003295418",
  appId: "1:168003295418:web:64d8609c0ffba874558a83",
  measurementId: "G-Z9V04G0W9C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default db;