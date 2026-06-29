import { useEffect, useState } from 'react';
import type { ListWithFilmDetails } from '../../types/list';
import { useNavigate, useParams } from 'react-router-dom';
import { getList, deleteList } from '../../services/listService';
import FilmCard from '../../components/FilmCard/FilmCard';
import styles from './ListDetail.module.scss';

const ListDetail = () => {
  const [list, setList] = useState<ListWithFilmDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const loadList = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const myList = await getList(id);
        setList(myList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadList();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Delete this list ?')) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteList(id);
      navigate('/lists');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!list) return null;

  return (
    <section>
      <h1 className={styles.name}>{list.name}</h1>
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting' : 'Delete List'}
      </button>
      {list.description && <p className={styles.description}>{list.description}</p>}

      {list.listFilms.length === 0 ? (
        <p className={styles.empty}>No films in this list yet.</p>
      ) : (
        <ul className={styles.results}>
          {list.listFilms.map(({ film }) => (
            <FilmCard
              key={film.tmdbId}
              tmdbId={film.tmdbId}
              title={film.title}
              posterUrl={film.posterUrl}
              releaseYear={film.releaseYear !== null ? String(film.releaseYear) : null}
              voteAverage={film.tmdbRating ?? 0}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ListDetail;
