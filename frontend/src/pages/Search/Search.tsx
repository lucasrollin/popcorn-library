import React, { useState } from 'react';
import type { FilmSearchResult } from '../../types/film';
import { searchFilms } from '../../services/filmService';
import FilmCard from '../../components/FilmCard/FilmCard';
import Button from '../../components/Button/Button';
import styles from './Search.module.scss';

const Search = () => {
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState<FilmSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

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
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </Button>
      </form>

      {error && <p className={styles.error}>Error: {error}</p>}
      {noResults && <p className={styles.empty}>No results. Try another title.</p>}

      <ul className={styles.results}>
        {films.map((film) => (
          <FilmCard
            key={film.tmdbId}
            tmdbId={film.tmdbId}
            title={film.title}
            posterUrl={film.posterUrl}
            releaseYear={film.releaseYear !== null ? String(film.releaseYear) : null}
            voteAverage={film.tmdbRating}
          />
        ))}
      </ul>
    </>
  );
};

export default Search;
