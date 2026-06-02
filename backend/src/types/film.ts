export interface FilmDetails {
  tmdbId: number;
  imdbId: string | null;
  title: string;
  overview: string | null;
  posterUrl: string | null;
  releaseYear: number | null;
  tmdbRating: number;
  tmdbVotesCount: number;
}
