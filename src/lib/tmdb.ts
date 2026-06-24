const IMG = 'https://image.tmdb.org/t/p';

function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string | null {
	return path ? `${IMG}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
	return path ? `${IMG}/${size}${path}` : null;
}

/** Streaming-provider logo (square). Null when no logo path is known. */
export function providerLogoUrl(path: string | null, size: 'w45' | 'w92' = 'w92'): string | null {
	return path ? `${IMG}/${size}${path}` : null;
}

export function tmdbPageUrl(type: 'movie' | 'tv', id: number, title?: string): string {
	const slug = title ? `-${slugify(title)}` : '';
	return `https://www.themoviedb.org/${type}/${id}${slug}/watch`;
}

export function tmdbEpisodeUrl(showId: number, season: number, episode: number): string {
	return `https://www.themoviedb.org/tv/${showId}/season/${season}/episode/${episode}`;
}

/** IMDb title page (works for a show, movie, or single episode by its own id).
 * Returns null when no IMDb id is known. */
export function imdbUrl(imdbId: string | null | undefined): string | null {
	return imdbId ? `https://www.imdb.com/title/${imdbId}/` : null;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Rotten Tomatoes episode page, e.g. tv/marvels_agents_of_shield/s03/e01.
 * Needs the show's RT slug (incl. the "tv/" prefix); null otherwise. */
export function rtEpisodeUrl(
	slug: string | null | undefined,
	season: number,
	episode: number
): string | null {
	if (!slug) return null;
	return `https://www.rottentomatoes.com/${slug}/s${pad2(season)}/e${pad2(episode)}`;
}

/**
 * Rotten Tomatoes link. Uses the curated `slug` (e.g. "m/iron_man") when present
 * for a direct hit; otherwise falls back to an RT search on the title, which
 * always resolves — RT has no public API to look slugs up at build time.
 */
export function rtUrl(slug: string | null | undefined, title: string): string {
	if (slug) return `https://www.rottentomatoes.com/${slug}`;
	return `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`;
}
