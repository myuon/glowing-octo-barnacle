import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBr4A7VcM-II6mnlabvd6dT5-qxFg4b8H0",
  authDomain: "myuon-play-music-app.firebaseapp.com",
  projectId: "myuon-play-music-app",
  storageBucket: "myuon-play-music-app.appspot.com",
  messagingSenderId: "657685491388",
  appId: "1:657685491388:web:c92a9b0dd21071ada8eab9",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
