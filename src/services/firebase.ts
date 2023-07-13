import { initializeApp } from "firebase/app";
import "firebase/storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAAE4ZehRs2zUjtYid5zxPXgjN3hpUk7Mw",
    authDomain: "tag-generater.firebaseapp.com",
    projectId: "tag-generater",
    storageBucket: "tag-generater.appspot.com",
    messagingSenderId: "1022394906830",
    appId: "1:1022394906830:web:20ecb1270fcf293bd3b89f",
    measurementId: "G-QZ7JZJNVSB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, auth };
