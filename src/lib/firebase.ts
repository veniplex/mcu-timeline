import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const config = {
	apiKey: env.PUBLIC_FIREBASE_API_KEY,
	authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: env.PUBLIC_FIREBASE_APP_ID
};

/** True when Firebase env vars are present — gates auth/tracking UI. */
export const firebaseEnabled = browser && Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

function ensureApp(): FirebaseApp {
	if (!firebaseEnabled) throw new Error('Firebase is not configured');
	if (!app) app = getApps().length ? getApps()[0] : initializeApp(config);
	return app;
}

export function getAuthClient(): Auth {
	if (!authInstance) authInstance = getAuth(ensureApp());
	return authInstance;
}

export function getDb(): Firestore {
	if (!dbInstance) dbInstance = getFirestore(ensureApp());
	return dbInstance;
}
