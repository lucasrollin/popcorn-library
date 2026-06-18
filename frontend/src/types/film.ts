export interface FilmSearchResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface FilmDetails {
  tmdbId: number;
  imdbId: string | null;
  title: string;
  tmdbRating: number;
  tmdbVotesCount: number;
  posterUrl: string | null;
  releaseYear: number | null;
  overview: string | null;
}
