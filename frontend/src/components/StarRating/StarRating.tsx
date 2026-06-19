import { useState } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  value: number;
  onRate: (score: number) => void;
}

const StarRating = ({ value, onRate }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const ratingArray = [1, 2, 3, 4, 5];

  return (
    <div className={styles.stars} onMouseLeave={() => setHover(0)}>
      {ratingArray.map((n) => {
        const filled = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            className={`${styles.star} ${filled ? styles.filled : ''}`}
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onRate(n)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
