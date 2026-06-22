const IMG = 'https://image.tmdb.org/t/p';

export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string | null {
	return path ? `${IMG}/${size}${path}` : null;
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
	return path ? `${IMG}/${size}${path}` : null;
}

export function tmdbPageUrl(type: 'movie' | 'tv', id: number): string {
	return `https://www.themoviedb.org/${type}/${id}`;
}
