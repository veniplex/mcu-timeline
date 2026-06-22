import { derived } from 'svelte/store';
import { locale, type Locale } from '$lib/stores/locale';

/**
 * Lightweight typed i18n. UI-chrome strings only — title/overview content
 * comes from the localized TMDB catalogs (catalog.{locale}.json).
 */
export const messages = {
	en: {
		'app.title': 'MCU Timeline',
		'app.tagline': 'Explore the Marvel Cinematic Universe in order',
		'sort.chronological': 'Chronological',
		'sort.release': 'Release date',
		'sort.label': 'Sort by',
		'theme.toggle': 'Toggle theme',
		'theme.light': 'Light',
		'theme.dark': 'Dark',
		'lang.label': 'Language',
		'auth.signIn': 'Sign in',
		'auth.signOut': 'Sign out',
		'auth.google': 'Continue with Google',
		'auth.github': 'Continue with GitHub',
		'auth.trackPrompt': 'Sign in to track what you have watched',
		'watched.mark': 'Mark as watched',
		'watched.unmark': 'Mark as unwatched',
		'watched.progress': 'Watched {done} of {total}',
		'filter.all': 'All',
		'filter.films': 'Films',
		'filter.series': 'Series',
		'filter.hideWatched': 'Hide watched',
		'phase.label': 'Phase',
		'detail.viewTmdb': 'View on TMDB',
		'detail.episodes': 'Episodes',
		'empty.title': 'Nothing here yet',
		'empty.body': 'The timeline data is being assembled.',
		'timeline.end': 'To be continued…'
	},
	de: {
		'app.title': 'MCU-Zeitleiste',
		'app.tagline': 'Erkunde das Marvel Cinematic Universe in der richtigen Reihenfolge',
		'sort.chronological': 'Chronologisch',
		'sort.release': 'Veröffentlichung',
		'sort.label': 'Sortieren nach',
		'theme.toggle': 'Design wechseln',
		'theme.light': 'Hell',
		'theme.dark': 'Dunkel',
		'lang.label': 'Sprache',
		'auth.signIn': 'Anmelden',
		'auth.signOut': 'Abmelden',
		'auth.google': 'Weiter mit Google',
		'auth.github': 'Weiter mit GitHub',
		'auth.trackPrompt': 'Melde dich an, um deinen Fortschritt zu speichern',
		'watched.mark': 'Als gesehen markieren',
		'watched.unmark': 'Als ungesehen markieren',
		'watched.progress': '{done} von {total} gesehen',
		'filter.all': 'Alle',
		'filter.films': 'Filme',
		'filter.series': 'Serien',
		'filter.hideWatched': 'Gesehene ausblenden',
		'phase.label': 'Phase',
		'detail.viewTmdb': 'Auf TMDB ansehen',
		'detail.episodes': 'Episoden',
		'empty.title': 'Noch nichts vorhanden',
		'empty.body': 'Die Zeitleisten-Daten werden gerade zusammengestellt.',
		'timeline.end': 'Fortsetzung folgt …'
	}
} as const;

export type MessageKey = keyof (typeof messages)['en'];

function translate(loc: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
	let str: string = messages[loc][key] ?? messages.en[key] ?? key;
	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			str = str.replace(`{${k}}`, String(v));
		}
	}
	return str;
}

/** Reactive translator: `$t('app.title')`. */
export const t = derived(locale, ($locale) => {
	return (key: MessageKey, vars?: Record<string, string | number>) =>
		translate($locale, key, vars);
});
