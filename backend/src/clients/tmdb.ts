import { config } from '../config.js';

export interface TmdbSearchMovie {
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
  const params = new URLSearchParams({ query, language: 'en-US' });
  const url = `${config.TMDB_BASE_URL}/search/movie?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  const data = (await res.json()) as TmdbSearchResponse;

  return data;
};

interface TmdbCastMember {
  name: string;
  character: string;
}

interface TmdbCrewMember {
  name: string;
  job: string;
}

interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  imdb_id: string | null;
  // Always present: getMovieDetails always asks for append_to_response=credits
  credits: TmdbCredits;
}

export const getMovieDetails = async (tmdbId: number): Promise<TmdbMovieDetails | null> => {
  // append_to_response: TMDB folds the /credits sub-resource into THIS response,
  // which saves a second network round trip to /movie/:id/credits
  const params = new URLSearchParams({ language: 'en-US', append_to_response: 'credits' });
  const url = `${config.TMDB_BASE_URL}/movie/${tmdbId}?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}` },
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
