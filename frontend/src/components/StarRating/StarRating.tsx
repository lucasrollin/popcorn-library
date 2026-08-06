import { useState } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  value: number;
  onRate: (score: number) => void;
}

const StarRating = ({ value, onRate }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  // The score just clicked: popcorns 1..justRated burst in sequence.
  // 0 = no animation running.
  const [justRated, setJustRated] = useState(0);
  const ratingArray = [1, 2, 3, 4, 5];

  const handleClick = (n: number) => {
    setJustRated(n);
    onRate(n);
  };

  return (
    <div className={styles.stars} onMouseLeave={() => setHover(0)}>
      {ratingArray.map((n) => {
        const filled = n <= (hover || value);
        const popping = n <= justRated;
        return (
          <button
            key={n}
            type="button"
            className={`${styles.star} ${filled ? styles.filled : ''} ${popping ? styles.pop : ''}`}
            // Growing offset: the wave starts from the left.
            style={popping ? { animationDelay: `${(n - 1) * 60}ms` } : undefined}
            aria-label={`Rate ${n} out of 5`}
            onMouseEnter={() => setHover(n)}
            onClick={() => handleClick(n)}
            // Only the last popcorn of the wave resets the counter: cutting on
            // the first one to finish would kill the animation of the rest.
            onAnimationEnd={() => {
              if (n === justRated) setJustRated(0);
            }}
          >
            🍿
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
