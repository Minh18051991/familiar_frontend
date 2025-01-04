import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDvIFdQKwT4N1aUsTe7P2szAxZy1o0n6mA",
  authDomain: "familiar-c17d5.firebaseapp.com",
  projectId: "familiar-c17d5",
  storageBucket: "familiar-c17d5.firebasestorage.app",
  messagingSenderId: "886629068164",
  appId: "1:886629068164:web:f18a0e09ab459fe8b481d1",
  measurementId: "G-DLXDBT44F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Analytics
const analytics = getAnalytics(app);

export { app, storage, analytics };
