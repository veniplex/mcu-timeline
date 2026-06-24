import { derived } from "svelte/store";
import { locale, type Locale } from "$lib/stores/locale";

/**
 * Lightweight typed i18n. UI-chrome strings only — title/overview content
 * comes from the localized TMDB catalogs (catalog.{locale}.json).
 */
export const messages = {
  en: {
    "app.title": "MCU Timeline",
    "app.tagline": "Explore the Marvel Cinematic Universe in order",
    "sort.chronological": "Story Order",
    "sort.release": "Release date",
    "sort.label": "Sort by",
    "theme.toggle": "Toggle theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "lang.label": "Language",
    "auth.signIn": "Sign in",
    "auth.signOut": "Sign out",
    "auth.google": "Continue with Google",
    "auth.github": "Continue with GitHub",
    "auth.trackPrompt": "Sign in to track what you have watched",
    "watched.mark": "Mark as watched",
    "watched.unmark": "Mark as unwatched",
    "watched.progress": "{done} of {total}",
    "filter.all": "All",
    "filter.films": "Films",
    "filter.series": "Series",
    "filter.hideWatched": "Hide watched",
    "phase.label": "Phase",
    "detail.viewTmdb": "View on TMDB",
    "detail.episodes": "Episodes",
    "detail.season": "Season",
    "empty.title": "Nothing here yet",
    "empty.body": "Try adjusting your filters.",
    "timeline.end": "To be continued…",
    "footer.source": "GitHub",
    "footer.stars": "stars",
    "footer.dataBy": "Data by {tmdb}. Ratings via IMDb & Rotten Tomatoes.",
    "footer.tmdbDisclaimer":
      "This product uses the TMDB API but is not endorsed or certified by TMDB.",
    "footer.fanProject":
      "An open-source, non-commercial fan project. Not affiliated with or endorsed by Marvel Studios or The Walt Disney Company. All trademarks and imagery belong to their respective owners.",
    "footer.license": "MIT licensed",
  },
  de: {
    "app.title": "MCU-Zeitleiste",
    "app.tagline":
      "Erkunde das Marvel Cinematic Universe in der richtigen Reihenfolge",
    "sort.chronological": "Story-Reihenfolge",
    "sort.release": "Veröffentlichung",
    "sort.label": "Sortieren nach",
    "theme.toggle": "Design wechseln",
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "lang.label": "Sprache",
    "auth.signIn": "Anmelden",
    "auth.signOut": "Abmelden",
    "auth.google": "Weiter mit Google",
    "auth.github": "Weiter mit GitHub",
    "auth.trackPrompt": "Melde dich an, um deinen Fortschritt zu speichern",
    "watched.mark": "Als gesehen markieren",
    "watched.unmark": "Als ungesehen markieren",
    "watched.progress": "{done} von {total}",
    "filter.all": "Alle",
    "filter.films": "Filme",
    "filter.series": "Serien",
    "filter.hideWatched": "Gesehene ausblenden",
    "phase.label": "Phase",
    "detail.viewTmdb": "Auf TMDB ansehen",
    "detail.episodes": "Episoden",
    "detail.season": "Staffel",
    "empty.title": "Noch nichts vorhanden",
    "empty.body": "Versuche, deine Filter anzupassen.",
    "timeline.end": "Fortsetzung folgt …",
    "footer.source": "GitHub",
    "footer.stars": "Sterne",
    "footer.dataBy":
      "Daten von {tmdb}. Bewertungen via IMDb & Rotten Tomatoes.",
    "footer.tmdbDisclaimer":
      "Dieses Produkt nutzt die TMDB-API, ist aber nicht von TMDB unterstützt oder zertifiziert.",
    "footer.fanProject":
      "Ein quelloffenes, nicht-kommerzielles Fan-Projekt. Nicht mit Marvel Studios oder The Walt Disney Company verbunden oder von ihnen unterstützt. Alle Marken und Bilder gehören ihren jeweiligen Eigentümern.",
    "footer.license": "MIT-lizenziert",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

function translate(
  loc: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
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
