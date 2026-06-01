// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-72e62.firebaseapp.com",
  projectId: "real-estate-72e62",
  storageBucket: "real-estate-72e62.firebasestorage.app",
  messagingSenderId: "191084469263",
  appId: "1:191084469263:web:3afce7f938d5bbfb6c977a"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);