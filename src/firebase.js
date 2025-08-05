import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP-GWoyWLkHWZQ1lPJZDNFuMTt3ab_YXo",
  authDomain: "formforge-production.firebaseapp.com",
  projectId: "formforge-production",
  storageBucket: "formforge-production.firebasestorage.app",
  messagingSenderId: "329699313751",
  appId: "1:329699313751:web:b79d0c4e682f986113bb12",
  measurementId: "G-Q88R7NPJ03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;