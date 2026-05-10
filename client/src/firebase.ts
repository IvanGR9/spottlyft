import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvDdWrbpSzMMeXyrVRxjnMFgbxHSkkM28",
  authDomain: "spottlyft.firebaseapp.com",
  projectId: "spottlyft",
  storageBucket: "spottlyft.firebasestorage.app",
  messagingSenderId: "313133783047",
  appId: "1:313133783047:web:3388db5e4c05d44bbb32a2",
  measurementId: "G-Y7C0N3NCLB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
