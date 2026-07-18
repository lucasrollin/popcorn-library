import { useEffect, useState } from 'react';
import type { ListWithFilms } from '../../types/list';
import {
  addFilmToList,
  createList,
  getMyLists,
  removeFilmFromList,
} from '../../services/listService';
import styles from './AddToList.module.scss';
import Loader from '../Loader/Loader';

type Props = { tmdbId: number };

const AddToList = ({ tmdbId }: Props) => {
  const [lists, setLists] = useState<ListWithFilms[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const myLists = await getMyLists();
        setLists(myLists);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleToggle = async (list: ListWithFilms) => {
    const inList = list.listFilms.some((lf) => lf.film.tmdbId === tmdbId);

    try {
      if (inList) {
        await removeFilmFromList(list.id, tmdbId);
      } else {
        await addFilmToList(list.id, tmdbId);
      }
      setLists((prev) =>
        prev.map((l) =>
          l.id !== list.id
            ? l
            : {
                ...l,
                listFilms: inList
                  ? l.listFilms.filter((lf) => lf.film.tmdbId !== tmdbId)
                  : [...l.listFilms, { film: { tmdbId, posterUrl: null } }],
              },
        ),
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = newListName.trim();
    if (!trimmed) return;

    if (creating) return;

    try {
      setCreating(true);

      const newList = await createList(trimmed);
      await addFilmToList(newList.id, tmdbId);

      setLists((prev) => [
        ...prev,
        { ...newList, listFilms: [{ film: { tmdbId, posterUrl: null } }] },
      ]);
      setNewListName('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        Add to list
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.panel}>
            {loading ? (
              <Loader size="sm" />
            ) : error ? (
              <p className={`${styles.status} ${styles.error}`}>Error: {error}</p>
            ) : (
              lists.map((list) => (
                <label key={list.id} className={styles.row}>
                  <input
                    type="checkbox"
                    checked={list.listFilms.some((lf) => lf.film.tmdbId === tmdbId)}
                    onChange={() => handleToggle(list)}
                  />
                  {list.name}
                </label>
              ))
            )}
            <form className={styles.form} onSubmit={handleCreate}>
              <input
                className={styles.input}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name"
              />
              <button className={styles.createBtn} type="submit" disabled={creating}>
                Create
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddToList;
