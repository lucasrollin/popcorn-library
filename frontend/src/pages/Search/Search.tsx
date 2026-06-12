import React, { useState } from 'react';
import type { FilmSearchResult } from '../../types/film';
import { searchFilms } from '../../services/filmService';
import FilmCard from '../../components/FilmCard/FilmCard';
import styles from './Search.module.scss';

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

      <ul className={styles.results}>
        {films.map((film) => (
          <FilmCard
            key={film.id}
            title={film.title}
            posterPath={film.poster_path}
            releaseYear={film.release_date ? film.release_date.slice(0, 4) : null}
            voteAverage={film.vote_average}
          />
        ))}
      </ul>
    </>
  );
}
