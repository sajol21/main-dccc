import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration, provided by you.
const firebaseConfig = {
    apiKey: "AIzaSyDpLCk3uxRRXfNMfaYhXERedpUNLQSBRa0",
    authDomain: "dccc-main.firebaseapp.com",
    databaseURL: "https://dccc-main-default-rtdb.firebaseio.com", // Corrected based on Firebase warning to point to the correct DB region.
    projectId: "dccc-main",
    storageBucket: "dccc-main.firebasestorage.app",
    messagingSenderId: "32556317121",
    appId: "1:32556317121:web:c38f42a6d3abc7b9219740",
    measurementId: "G-707Q6W0NXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);

// Get a reference to the auth service
export const auth = getAuth(app);