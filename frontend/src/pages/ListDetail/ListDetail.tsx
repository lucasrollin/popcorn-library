import { useEffect, useState } from 'react';
import type { ListWithFilmDetails } from '../../types/list';
import { useNavigate, useParams } from 'react-router-dom';
import { getList, deleteList, updateList } from '../../services/listService';
import FilmCard from '../../components/FilmCard/FilmCard';
import Button from '../../components/Button/Button';
import styles from './ListDetail.module.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import formStyles from '../../styles/authForm.module.scss';
import { useAuthStore } from '../../stores/authStore';

const ListDetail = () => {
  const [list, setList] = useState<ListWithFilmDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { id } = useParams<{ id: string }>();

  const editListSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(256),
    description: z.string().max(10000),
    isPublic: z.boolean(),
  });

  type EditListFormValues = z.infer<typeof editListSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditListFormValues>({ resolver: zodResolver(editListSchema) });

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

  const startEditing = () => {
    if (!list) return;
    reset({ name: list.name, description: list.description ?? '', isPublic: list.isPublic });
    setServerError(null);
    setEditing(true);
  };

  const onEditSubmit = async (data: EditListFormValues) => {
    if (!list) return;

    setServerError(null);

    try {
      const updated = await updateList(list.id, data);
      setList({ ...list, ...updated });
      setEditing(false);
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error}</p>;
  if (!list) return null;

  const isOwner = list.userId === user?.id;

  return (
    <section>
      {editing ? (
        <form onSubmit={handleSubmit(onEditSubmit)} className={formStyles.form}>
          <label className={formStyles.label}>
            Name
            <input {...register('name')} className={formStyles.input} />
          </label>
          {errors.name && <p className={formStyles.error}>{errors.name.message}</p>}
          <label className={formStyles.label}>
            Description
            <textarea {...register('description')} className={formStyles.input} />
          </label>
          <label>
            <input type="checkbox" {...register('isPublic')} /> Public
          </label>
          {serverError && <p className={formStyles.error}>{serverError}</p>}
          <div className={styles.formActions}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setServerError(null);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <h1 className={styles.name}>{list.name}</h1>
          {isOwner && (
            <div className={styles.actions}>
              <Button onClick={startEditing}>Edit</Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete list'}
              </Button>
            </div>
          )}
          {list.description && <p className={styles.description}>{list.description}</p>}
        </>
      )}

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
