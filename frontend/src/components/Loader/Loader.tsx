import styles from './Loader.module.scss';

type LoaderProps = {
  size?: 'sm' | 'md';
};

const Loader = ({ size = 'md' }: LoaderProps) => {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
};

export default Loader;
