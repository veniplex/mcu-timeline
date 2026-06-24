import { browser } from '$app/environment';
import { firebaseEnabled, getDb } from '$lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from './auth';
import { locale } from './locale';
import { theme } from './theme';
import { sortMode } from './sortMode';
import { filters, normalizeFilters } from './filters';

let currentUid: string | null = null;
let prefsLoaded = false;
let applying = false;

async function load(uid: string) {
	if (!firebaseEnabled) return;
	try {
		const snap = await getDoc(doc(getDb(), 'users', uid));
		if (!snap.exists()) return;
		applying = true;
		const d = snap.data();
		if (d.locale === 'en' || d.locale === 'de') locale.set(d.locale);
		if (d.theme === 'light' || d.theme === 'dark') theme.set(d.theme);
		if (d.sortMode === 'chronological' || d.sortMode === 'release') sortMode.set(d.sortMode);
		if (d.filters) filters.set(normalizeFilters(d.filters));
	} catch {
		// ignore
	} finally {
		applying = false;
		prefsLoaded = true;
	}
}

async function save(updates: Record<string, unknown>) {
	if (!firebaseEnabled || !currentUid || !prefsLoaded || applying) return;
	try {
		await setDoc(doc(getDb(), 'users', currentUid), updates, { merge: true });
	} catch {
		// ignore
	}
}

export function initUserPrefs() {
	if (!browser) return;

	let skipLocale = true;
	let skipTheme = true;
	let skipSort = true;
	let skipFilters = true;

	auth.subscribe(async (state) => {
		if (state.loading) return;
		const uid = state.user?.uid ?? null;
		if (uid === currentUid) return;
		currentUid = uid;
		prefsLoaded = false;
		if (uid) await load(uid);
	});

	locale.subscribe((val) => {
		if (skipLocale) { skipLocale = false; return; }
		save({ locale: val });
	});

	theme.subscribe((val) => {
		if (skipTheme) { skipTheme = false; return; }
		save({ theme: val });
	});

	sortMode.subscribe((val) => {
		if (skipSort) { skipSort = false; return; }
		save({ sortMode: val });
	});

	filters.subscribe((val) => {
		if (skipFilters) { skipFilters = false; return; }
		save({ filters: val });
	});
}
