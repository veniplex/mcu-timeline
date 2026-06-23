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

export function tmdbPageUrl(type: 'movie' | 'tv', id: number, title?: string): string {
	const slug = title ? `-${slugify(title)}` : '';
	return `https://www.themoviedb.org/${type}/${id}${slug}/watch`;
}

export function tmdbEpisodeUrl(showId: number, season: number, episode: number): string {
	return `https://www.themoviedb.org/tv/${showId}/season/${season}/episode/${episode}`;
}
