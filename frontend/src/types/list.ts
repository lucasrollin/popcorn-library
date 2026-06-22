export interface List {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ListFilm {
  id: string;
  addedAt: string;
  listId: string;
  filmId: string;
}

export interface ListWithFilms extends List {
  listFilms: { film: { tmdbId: number } }[];
}
