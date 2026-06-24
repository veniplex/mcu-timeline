import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { firebaseEnabled, getDb } from '$lib/firebase';
import { auth } from './auth';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	serverTimestamp,
	type Timestamp
} from 'firebase/firestore';

/** Map of watched unit key → watchedAt timestamp (ms) for the signed-in user. */
const store = writable<Map<string, number>>(new Map());

let currentUid: string | null = null;

function toMillis(value: unknown): number {
	const ts = value as Timestamp | undefined;
	return ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now();
}

if (browser && firebaseEnabled) {
	auth.subscribe(async (state) => {
		const uid = state.user?.uid ?? null;
		if (uid === currentUid) return;
		currentUid = uid;
		if (!uid) {
			store.set(new Map());
			return;
		}
		try {
			const snap = await getDocs(collection(getDb(), 'users', uid, 'watched'));
			const map = new Map<string, number>();
			for (const d of snap.docs) map.set(d.id, toMillis(d.data().watchedAt));
			store.set(map);
		} catch {
			store.set(new Map());
		}
	});
}

/** Set of watched unit keys (membership only) — back-compat for `.has`/iteration. */
export const watched = derived(store, (m) => new Set(m.keys()));

/** Map of watched unit key → watchedAt timestamp (ms). */
export const watchedAt = { subscribe: store.subscribe };

/** Toggle a single entry id; optimistic, persisted to Firestore. */
export async function toggleWatched(entryId: string) {
	if (!firebaseEnabled || !currentUid) return;
	const map = new Map(get(store));
	const isWatched = map.has(entryId);
	if (isWatched) map.delete(entryId);
	else map.set(entryId, Date.now());
	store.set(map); // optimistic

	const ref = doc(getDb(), 'users', currentUid, 'watched', entryId);
	try {
		if (isWatched) await deleteDoc(ref);
		else await setDoc(ref, { watchedAt: serverTimestamp() });
	} catch {
		// revert on failure
		const revert = new Map(get(store));
		if (isWatched) revert.set(entryId, Date.now());
		else revert.delete(entryId);
		store.set(revert);
	}
}

/** Set/clear watched for several entry ids at once (merged blocks). */
export async function setWatchedMany(entryIds: string[], value: boolean) {
	if (!firebaseEnabled || !currentUid) return;
	const map = new Map(get(store));
	const now = Date.now();
	for (const id of entryIds) value ? map.set(id, now) : map.delete(id);
	store.set(map);
	const db = getDb();
	await Promise.allSettled(
		entryIds.map((id) => {
			const ref = doc(db, 'users', currentUid!, 'watched', id);
			return value ? setDoc(ref, { watchedAt: serverTimestamp() }) : deleteDoc(ref);
		})
	);
}

/** Wipe all watched data for the current user — fresh start. Optimistic. */
export async function resetWatched() {
	if (!firebaseEnabled || !currentUid) return;
	const prev = new Map(get(store));
	store.set(new Map());
	try {
		const db = getDb();
		const snap = await getDocs(collection(db, 'users', currentUid, 'watched'));
		await Promise.allSettled(
			snap.docs.map((d) => deleteDoc(doc(db, 'users', currentUid!, 'watched', d.id)))
		);
	} catch {
		store.set(prev); // restore on failure
	}
}
