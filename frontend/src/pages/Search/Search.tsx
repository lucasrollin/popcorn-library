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
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchFilms(trimmed);
      setFilms(data);
      setHasSearched(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const noResults = hasSearched && !loading && !error && films.length === 0;

  return (
    <>
      <h1 className={styles.heading}>Search</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a film…"
          aria-label="Search for a film"
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className={styles.error}>Error: {error}</p>}
      {noResults && <p className={styles.empty}>No results. Try another title.</p>}

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
