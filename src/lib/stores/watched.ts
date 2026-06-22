import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { firebaseEnabled, getDb } from '$lib/firebase';
import { auth } from './auth';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	serverTimestamp
} from 'firebase/firestore';

/** Set of watched chronology-entry ids for the signed-in user. */
const store = writable<Set<string>>(new Set());

let currentUid: string | null = null;

if (browser && firebaseEnabled) {
	auth.subscribe(async (state) => {
		const uid = state.user?.uid ?? null;
		if (uid === currentUid) return;
		currentUid = uid;
		if (!uid) {
			store.set(new Set());
			return;
		}
		try {
			const snap = await getDocs(collection(getDb(), 'users', uid, 'watched'));
			store.set(new Set(snap.docs.map((d) => d.id)));
		} catch {
			store.set(new Set());
		}
	});
}

export const watched = { subscribe: store.subscribe };

/** Toggle a single entry id; optimistic, persisted to Firestore. */
export async function toggleWatched(entryId: string) {
	if (!firebaseEnabled || !currentUid) return;
	const set = new Set(get(store));
	const isWatched = set.has(entryId);
	if (isWatched) set.delete(entryId);
	else set.add(entryId);
	store.set(set); // optimistic

	const ref = doc(getDb(), 'users', currentUid, 'watched', entryId);
	try {
		if (isWatched) await deleteDoc(ref);
		else await setDoc(ref, { watchedAt: serverTimestamp() });
	} catch {
		// revert on failure
		const revert = new Set(get(store));
		if (isWatched) revert.add(entryId);
		else revert.delete(entryId);
		store.set(revert);
	}
}

/** Set/clear watched for several entry ids at once (merged blocks). */
export async function setWatchedMany(entryIds: string[], value: boolean) {
	if (!firebaseEnabled || !currentUid) return;
	const set = new Set(get(store));
	for (const id of entryIds) value ? set.add(id) : set.delete(id);
	store.set(set);
	const db = getDb();
	await Promise.allSettled(
		entryIds.map((id) => {
			const ref = doc(db, 'users', currentUid!, 'watched', id);
			return value ? setDoc(ref, { watchedAt: serverTimestamp() }) : deleteDoc(ref);
		})
	);
}
