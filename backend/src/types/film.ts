export interface FilmSearchResult {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseYear: number | null;
  tmdbRating: number;
}

export interface FilmDetails {
  tmdbId: number;
  imdbId: string | null;
  title: string;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: number | null;
  tmdbRating: number;
  tmdbVotesCount: number;
}
