// Firebase Admin SDK initialization for server-side operations
import admin from 'firebase-admin';

// Initialize Firebase Admin
// The service account key should be stored as an environment variable
let app;

if (!admin.apps.length) {
  try {
    // Parse the service account from environment variable
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'formforge-production'
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    // Fallback to application default credentials (for Google Cloud environments)
    app = admin.initializeApp({
      projectId: 'formforge-production'
    });
  }
} else {
  app = admin.app();
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;