import { useEffect, useState } from 'react';
import type { List } from '../../types/list';
import { getPublicLists } from '../../services/listService';
import Loader from '../../components/Loader/Loader';
import { Link } from 'react-router-dom';
import styles from './PublicLists.module.scss';

const PublicLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicLists();
        setLists(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error : {error}</p>;

  return (
    <section>
      <h1 className={styles.name}>Public Lists</h1>
      {lists.length === 0 ? (
        <p>No public lists yet.</p>
      ) : (
        <ul className={styles.lists}>
          {lists.map((list) => (
            <li className={styles.card} key={list.id}>
              <Link to={`/lists/${list.id}`}>
                {list.name}
                {list.description && <span className={styles.description}>{list.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PublicLists;
