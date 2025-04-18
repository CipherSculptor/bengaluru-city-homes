// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC8zSd4DKiuIyHndqEbGvfxowOPUWlX8g",
  authDomain: "bengalurucityhomes.firebaseapp.com",
  projectId: "bengalurucityhomes",
  storageBucket: "bengalurucityhomes.firebasestorage.app",
  messagingSenderId: "1090952896941",
  appId: "1:1090952896941:web:cfd00bbda5cc570c7ec124",
  measurementId: "G-CPL9R00CZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app;
