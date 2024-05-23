
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBh_BuKgQ40DX7ZANaT0F7DXAUxxUnJixA",
    authDomain: "devmotors-ebd8a.firebaseapp.com",
    projectId: "devmotors-ebd8a",
    storageBucket: "devmotors-ebd8a.appspot.com",
    messagingSenderId: "817894958107",
    appId: "1:817894958107:web:91d7dadc6586e0788844be"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage } ;