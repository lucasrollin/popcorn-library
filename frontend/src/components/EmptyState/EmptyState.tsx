import { Link } from 'react-router-dom';
import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  emoji: string;
  message: string;
  action?: {
    label: string;
    to: string;
  };
};

const EmptyState = ({ emoji, message, action }: EmptyStateProps) => {
  return (
    <div className={styles.empty}>
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
