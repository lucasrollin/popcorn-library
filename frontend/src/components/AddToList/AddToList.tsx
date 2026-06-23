import { useEffect, useState } from 'react';
import type { ListWithFilms } from '../../types/list';
import {
  addFilmToList,
  createList,
  getMyLists,
  removeFilmFromList,
} from '../../services/listService';

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
                  : [...l.listFilms, { film: { tmdbId } }],
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

      setLists((prev) => [...prev, { ...newList, listFilms: [{ film: { tmdbId } }] }]);
      setNewListName('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}>Add to list</button>

      {open && (
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            lists.map((list) => (
              <label key={list.id}>
                <input
                  type="checkbox"
                  checked={list.listFilms.some((lf) => lf.film.tmdbId === tmdbId)}
                  onChange={() => handleToggle(list)}
                />
                {list.name}
              </label>
            ))
          )}
          <form onSubmit={handleCreate}>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name"
            />
            <button type="submit" disabled={creating}>
              Create
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddToList;
