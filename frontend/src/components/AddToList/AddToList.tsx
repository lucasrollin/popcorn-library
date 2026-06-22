import { useEffect, useState } from 'react';
import type { ListWithFilms } from '../../types/list';
import { getMyLists } from '../../services/listService';

type Props = { tmdbId: number };

const AddToList = ({ tmdbId }: Props) => {
  const [lists, setLists] = useState<ListWithFilms[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
                  onChange={() => {}}
                />
                {list.name}
              </label>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default AddToList;
