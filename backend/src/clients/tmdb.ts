const TMDB_BASE_URL = process.env.TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
if (!TMDB_ACCESS_TOKEN) {
  throw new Error('TMDB_ACCESS_TOKEN is missing');
}

interface TmdbSearchMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchMovie[];
  total_pages: number;
  total_results: number;
}

export const searchMovies = async (query: string): Promise<TmdbSearchResponse> => {
  const params = new URLSearchParams({ query, language: 'fr-FR' });
  const url = `${TMDB_BASE_URL}/search/movie?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  const data = (await res.json()) as TmdbSearchResponse;

  return data;
};

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  imdb_id: string | null;
}

export const getMovieDetails = async (tmdbId: number): Promise<TmdbMovieDetails | null> => {
  const params = new URLSearchParams({ language: 'fr-FR' });
  const url = `${TMDB_BASE_URL}/movie/${tmdbId}?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`TMDB movie details search failed: ${res.status}`);
  }

  const data = (await res.json()) as TmdbMovieDetails;

  return data;
};
