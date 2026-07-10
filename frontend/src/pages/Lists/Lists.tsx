import { useEffect, useState } from 'react';
import type { ListWithFilms } from '../../types/list';
import { useAuthStore } from '../../stores/authStore';
import { getMyLists } from '../../services/listService';
import Loader from '../../components/Loader/Loader';
import { Link } from 'react-router-dom';
import styles from './Lists.module.scss';

const Lists = () => {
  const user = useAuthStore((s) => s.user);
  const [lists, setLists] = useState<ListWithFilms[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getMyLists();
        setLists(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <p>Error : {error}</p>;
  if (!user) return <p>Log in to see your lists.</p>;

  return (
    <section>
      <h1 className={styles.name}>My Lists</h1>
      {lists.length === 0 ? (
        <p>You don't have any lists yet.</p>
      ) : (
        <ul className={styles.lists}>
          {lists.map((list) => (
            <li className={styles.card} key={list.id}>
              <Link to={`/lists/${list.id}`}>
                {list.name} ({list.listFilms.length})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Lists;
