import styles from './FilmCard.module.scss';
import { Link } from 'react-router-dom';

interface FilmCardProps {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  releaseYear: string | null;
  voteAverage: number;
}

const FilmCard = ({ tmdbId, title, posterUrl, releaseYear, voteAverage }: FilmCardProps) => {
  return (
    <li className={styles.card}>
      <Link to={`/films/${tmdbId}`} className={styles.link}>
        {posterUrl ? (
          <img className={styles.poster} src={posterUrl} alt={title} />
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
};

export default FilmCard;
