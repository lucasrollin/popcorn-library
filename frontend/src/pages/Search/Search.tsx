import React, { useState } from 'react';
import type { FilmSearchResult } from '../../types/film';
import { searchFilms } from '../../services/filmService';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

export default function Search() {
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState<FilmSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchFilms(query);
      setFilms(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {films.map((film) => (
          <li key={film.id}>
            {film.title}
            {film.poster_path && (
              <img src={`${TMDB_IMAGE_BASE}${film.poster_path}`} alt={film.title} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
