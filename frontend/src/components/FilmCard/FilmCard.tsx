import styles from './FilmCard.module.scss';
import { Link } from 'react-router-dom';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

interface FilmCardProps {
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseYear: string | null;
  voteAverage: number;
}

export default function FilmCard({
  tmdbId,
  title,
  posterPath,
  releaseYear,
  voteAverage,
}: FilmCardProps) {
  return (
    <li className={styles.card}>
      <Link to={`/films/${tmdbId}`} className={styles.link}>
        {posterPath ? (
          <img className={styles.poster} src={`${TMDB_IMAGE_BASE}${posterPath}`} alt={title} />
        ) : (
          <div className={styles.placeholder}>🍿</div>
        )}
        <div className={styles.info}>
          <p className={styles.title}>{title}</p>
          <p className={styles.meta}>
            {releaseYear && <span>{releaseYear}</span>}
            {voteAverage > 0 && <span className={styles.rating}>★ {voteAverage.toFixed(1)}</span>}
          </p>
        </div>
      </Link>
    </li>
  );
}
