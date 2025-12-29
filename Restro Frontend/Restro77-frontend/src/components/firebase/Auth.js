import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvEJ-j3FsNs8y0GRbd_qZat2-FR2cVVsg",
  authDomain: "myfirstapp-dde25.firebaseapp.com",
  projectId: "myfirstapp-dde25",
  storageBucket: "myfirstapp-dde25.firebasestorage.app",
  messagingSenderId: "944508018793",
  appId: "1:944508018793:web:94e9c3d15c652604c4c2f8",
  measurementId: "G-BEC3FMES4B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
