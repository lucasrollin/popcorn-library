import { useEffect, useState } from 'react';
import type { ListWithFilms } from '../../types/list';
import { getMyLists } from '../../services/listService';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import ListCard from '../../components/ListCard/ListCard';
import styles from './Lists.module.scss';

const Lists = () => {
  const [lists, setLists] = useState<ListWithFilms[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLists = async () => {
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
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error : {error}</p>;

  return (
    <section>
      <h1 className={styles.name}>My Lists</h1>
      {lists.length === 0 ? (
        <EmptyState
          emoji="🍿"
          message="You don't have any lists yet."
          action={{ label: 'Find films to start one', to: '/search' }}
        />
      ) : (
        <ul className={styles.lists}>
          {lists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              filmCount={list.listFilms.length}
              posterUrls={list.listFilms.slice(0, 4).map((lf) => lf.film.posterUrl)}
              isPublic={list.isPublic}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default Lists;
