import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQpdrYbLMVLkLW2YDEmYFohTxtAm-f69Q",
  authDomain: "crypto-coin-project-7fc87.firebaseapp.com",
  projectId: "crypto-coin-project-7fc87",
  storageBucket: "crypto-coin-project-7fc87.firebasestorage.app",
  messagingSenderId: "902980775808",
  appId: "1:902980775808:web:062b53ef98fecf5507db65",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user; 
    await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: name,
        email: email,
        authProvider:"local",
        });
 } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
};

const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
}   

const logout = () => {
  signOut(auth);
};

export { auth, db, signup, login, logout };