import { useState } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  value: number;
  onRate: (score: number) => void;
}

const StarRating = ({ value, onRate }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  // Note qui vient d'être cliquée : les popcorns 1..justRated éclatent en
  // cascade. 0 = aucune animation en cours.
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
            // Décalage croissant : la vague part de la gauche.
            style={popping ? { animationDelay: `${(n - 1) * 60}ms` } : undefined}
            aria-label={`Rate ${n} out of 5`}
            onMouseEnter={() => setHover(n)}
            onClick={() => handleClick(n)}
            // Seul le dernier popcorn de la vague remet le compteur à zéro :
            // couper dès le premier arrivé tuerait l'animation des suivants.
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
