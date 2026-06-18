import { useParams } from 'react-router-dom';
import type { FilmDetails } from '../../types/film';
import { useState, useEffect } from 'react';
import { getFilm } from '../../services/filmService';
import styles from './FilmDetail.module.scss';

const FilmDetail = () => {
  const [film, setFilm] = useState<FilmDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { tmdbId } = useParams<{ tmdbId: string }>();

  useEffect(() => {
    const loadFilm = async () => {
      if (!tmdbId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getFilm(Number(tmdbId));
        setFilm(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadFilm();
  }, [tmdbId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!film) return null;

  return (
    <article className={styles.film}>
      {film.posterUrl ? (
        <img className={styles.poster} src={film.posterUrl} alt={film.title} />
      ) : (
        <div className={styles.placeholder}>🍿</div>
      )}

      <div className={styles.info}>
        <h1 className={styles.title}>{film.title}</h1>

        <div className={styles.meta}>
          {film.releaseYear && <span>{film.releaseYear}</span>}
          {film.tmdbRating > 0 && (
            <span className={styles.rating}>★ {film.tmdbRating.toFixed(1)}</span>
          )}
          {film.tmdbVotesCount > 0 && <span>{film.tmdbVotesCount.toLocaleString()} votes</span>}
        </div>

        {film.overview ? (
          <p className={styles.overview}>{film.overview}</p>
        ) : (
          <p className={styles.empty}>No overview available.</p>
        )}
      </div>
    </article>
  );
};

export default FilmDetail;
