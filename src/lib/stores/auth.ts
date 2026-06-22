import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { firebaseEnabled, getAuthClient } from '$lib/firebase';
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
	signOut as fbSignOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';

export interface AuthState {
	user: User | null;
	loading: boolean;
}

const store = writable<AuthState>({ user: null, loading: firebaseEnabled });

if (browser && firebaseEnabled) {
	onAuthStateChanged(getAuthClient(), (user) => {
		store.set({ user, loading: false });
	});
}

export const auth = { subscribe: store.subscribe };

export async function signInWithGoogle() {
	await signInWithPopup(getAuthClient(), new GoogleAuthProvider());
}

export async function signInWithGithub() {
	await signInWithPopup(getAuthClient(), new GithubAuthProvider());
}

export async function signOut() {
	await fbSignOut(getAuthClient());
}
