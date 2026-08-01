import { Link } from 'react-router-dom';
import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  emoji: string;
  message: string;
  // Uniquement pour les pages dont le vide EST le contenu (la 404). Les autres
  // appelants ont déjà leur propre <h1> plus haut — ne pas en poser un second.
  title?: string;
  action?: {
    label: string;
    to: string;
  };
};

const EmptyState = ({ emoji, message, title, action }: EmptyStateProps) => {
  return (
    <div className={styles.empty}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <span className={styles.emoji} aria-hidden="true">
        {emoji}
      </span>
      <p className={styles.message}>{message}</p>
      {action && (
        <Link to={action.to} className={styles.action}>
          {action.label}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
