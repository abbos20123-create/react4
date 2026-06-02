  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";




  const firebaseConfig = {
    apiKey: "AIzaSyCUnDyTDKFUcybGARKzfLz0g4lnffxhSmc",
    authDomain: "pizza-e87b8.firebaseapp.com",
    projectId: "pizza-e87b8",
    storageBucket: "pizza-e87b8.firebasestorage.app",
    messagingSenderId: "805059389961",
    appId: "1:805059389961:web:4721be2d39a60a419366d8",
    measurementId: "G-Y7ZRQBPKPV"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app)
  export const auth = getAuth(app)