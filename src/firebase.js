import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBB8eT3UNQOKid_p2iP5kovU89AgeGPs6I",
  authDomain: "list-todo-49cac.firebaseapp.com",
  projectId: "list-todo-49cac",
  storageBucket: "list-todo-49cac.firebasestorage.app",
  messagingSenderId: "326732917530",
  appId: "1:326732917530:web:dcde28a57bb8ec6daf5aa3",
  databaseURL:
    "https://list-todo-49cac-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
