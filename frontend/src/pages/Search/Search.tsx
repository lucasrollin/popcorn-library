import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilmSearchResult } from '../../types/film';
import { searchFilms } from '../../services/filmService';
import FilmCard from '../../components/FilmCard/FilmCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import styles from './Search.module.scss';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [films, setFilms] = useState<FilmSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  usePageTitle('Search');

  const queryParam = searchParams.get('q')?.trim() ?? '';

  useEffect(() => {
    if (!queryParam) return;

    const runSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchFilms(queryParam);
        setFilms(data);
        setHasSearched(true);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [queryParam]);

  const noResults = hasSearched && !loading && !error && films.length === 0;

  return (
    <>
      <h1 className={styles.heading}>Search</h1>

      <div className={styles.searchBar}>
        <SearchBar
          defaultValue={queryParam}
          loading={loading}
          onSearch={(q) => setSearchParams({ q })}
        />
      </div>

      {loading && <Loader />}
      {error && <p className={styles.error}>Error: {error}</p>}
      {noResults && <EmptyState emoji="🔍" message="No results. Try another title." />}

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
