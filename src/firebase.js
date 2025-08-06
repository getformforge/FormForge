import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration from environment variables
// Note: In production, these should be set via Vercel environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBP-GWoyWLkHWZQ1lPJZDNFuMTt3ab_YXo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "formforge-production.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "formforge-production",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "formforge-production.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "329699313751",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:329699313751:web:b79d0c4e682f986113bb12",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q88R7NPJ03"
};

// Validate that we have the required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.warn('Firebase configuration is incomplete. Using default values.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;