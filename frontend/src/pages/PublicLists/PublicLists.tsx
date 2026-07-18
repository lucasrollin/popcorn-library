import { useEffect, useState } from 'react';
import type { PublicListWithFilms } from '../../types/list';
import { getPublicLists } from '../../services/listService';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import ListCard from '../../components/ListCard/ListCard';
import styles from './PublicLists.module.scss';

const PublicLists = () => {
  const [lists, setLists] = useState<PublicListWithFilms[]>([]);
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
        <EmptyState emoji="🎬" message="No public lists yet." />
      ) : (
        <ul className={styles.lists}>
          {lists.map((list) => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              filmCount={list.listFilms.length}
              posterUrls={list.listFilms.slice(0, 4).map((lf) => lf.film.posterUrl)}
              owner={list.user.username}
              description={list.description}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default PublicLists;
