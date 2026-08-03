export interface FilmSearchResult {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseYear: number | null;
  tmdbRating: number;
}

export interface CastMember {
  name: string;
  character: string;
}

export interface FilmDetails {
  tmdbId: number;
  imdbId: string | null;
  title: string;
  tmdbRating: number;
  tmdbVotesCount: number;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: number | null;
  overview: string | null;
  director: string | null;
  cast: CastMember[];
}
