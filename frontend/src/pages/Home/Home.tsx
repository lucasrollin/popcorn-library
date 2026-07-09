import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Home.module.scss';

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <section className={styles.hero}>
      <span className={styles.emoji} aria-hidden="true">
        🍿
      </span>
      <h1 className={styles.title}>Popcorn Library</h1>
      <p className={styles.tagline}>
        {user ? `Welcome back, ${user.username}. ` : ''}
        Search thousands of films, build your own lists, and rate what you watch.
      </p>

      <div className={styles.search}>
        <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
      </div>
    </section>
  );
};

export default Home;
