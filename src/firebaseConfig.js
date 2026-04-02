import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6B34DTjhIQBODwkLL46NWcWJa6eFMkD8",
    authDomain: "chatme-7f37a.firebaseapp.com",
    projectId: "chatme-7f37a",
    storageBucket: "chatme-7f37a.firebasestorage.app",
    messagingSenderId: "329581277288",
    appId: "1:329581277288:web:a1e89b4723ffd0589d4bdd",
    measurementId: "G-06JM3EE547"
};

const app = initializeApp(firebaseConfig);

export const initMessaging = async () => {
    const supported = await isSupported();

    if (supported) {
        return getMessaging(app);
    } else {
        console.warn("FCM not supported");
        return null;
    }
};
