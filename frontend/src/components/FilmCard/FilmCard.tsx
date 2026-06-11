import styles from './FilmCard.module.scss';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

interface FilmCardProps {
  title: string;
  posterPath: string | null;
}

export default function FilmCard({ title, posterPath }: FilmCardProps) {
  return (
    <li className={styles.card}>
      {posterPath ? (
        <img className={styles.poster} src={`${TMDB_IMAGE_BASE}${posterPath}`} alt={title} />
      ) : (
        <div className={styles.placeholder} />
      )}
      <p className={styles.title}>{title}</p>
    </li>
  );
}
