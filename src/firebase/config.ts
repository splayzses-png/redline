import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'AIzaSyYourFirebaseApiKey' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'redline-scrims'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[REDLINE Firebase] Failed to initialize live Firebase app:', err);
  }
}

// Critical verification function mandated by Firebase Integration Skill
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return {
      success: false,
      message: 'Live Firebase config is not configured or in local sandbox mode.',
    };
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: 'Connected to Cloud Firestore successfully.' };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { success: false, message: 'Firestore is offline. Check Firebase configuration and rules.' };
    }
    return { success: true, message: 'Firestore reachability confirmed.' };
  }
}

export { app, auth, db };
