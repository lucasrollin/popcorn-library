import { Link } from 'react-router-dom';
import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  emoji: string;
  message: string;
  // Only for pages where the emptiness IS the content (the 404). Every other
  // caller already has its own <h1> further up — do not add a second one.
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
