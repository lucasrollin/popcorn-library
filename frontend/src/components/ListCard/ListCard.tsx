import { Link } from 'react-router-dom';
import styles from './ListCard.module.scss';

interface ListCardProps {
  id: string;
  name: string;
  filmCount: number;
  posterUrls: (string | null)[];
  isPublic?: boolean;
  owner?: string;
  description?: string | null;
}

const ListCard = ({
  id,
  name,
  filmCount,
  posterUrls,
  isPublic,
  owner,
  description,
}: ListCardProps) => {
  const slots = Array.from({ length: 4 }, (_, i) => posterUrls[i] ?? null);

  return (
    <li className={styles.card}>
      <Link to={`/lists/${id}`} className={styles.link}>
        <div className={styles.mosaic} aria-hidden="true">
          {slots.map((url, i) =>
            url ? (
              <img key={i} className={styles.tile} src={url} alt="" loading="lazy" />
            ) : (
              <div key={i} className={styles.tile}>
                {i < posterUrls.length && '🍿'}
              </div>
            ),
          )}
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{name}</p>
          {description && <p className={styles.description}>{description}</p>}
          <p className={styles.meta}>
            <span>
              {filmCount} {filmCount === 1 ? 'film' : 'films'}
            </span>
            {isPublic !== undefined && (
              <span className={styles.badge}>{isPublic ? 'Public' : 'Private'}</span>
            )}
          </p>
        </div>
      </Link>
      {owner && (
        <Link to={`/users/${owner}`} className={styles.owner}>
          by {owner}
        </Link>
      )}
    </li>
  );
};

export default ListCard;
