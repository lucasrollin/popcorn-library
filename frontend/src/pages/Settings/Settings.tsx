import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import { updateMe, deleteMe } from '../../services/userService';
import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import usePageTitle from '../../hooks/usePageTitle';
import styles from './Settings.module.scss';

const settingsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  avatar: z.string().trim().url('Invalid URL').or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  usePageTitle('Settings');

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: user?.username ?? '',
      avatar: user?.avatar ?? '',
    },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    setServerError(null);
    setSuccess(null);
    try {
      const updated = await updateMe({
        username: values.username,
        avatar: values.avatar === '' ? null : values.avatar,
      });
      setUser(updated);
      setSuccess('Profile updated');
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteMe();
      clearUser();
      navigate('/');
    } catch (err) {
      setDeleteError((err as Error).message);
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1 className={styles.heading}>Settings</h1>

        <label className={styles.label}>
          Username
          <input
            type="text"
            autoComplete="username"
            {...register('username')}
            className={styles.input}
          />
        </label>
        {errors.username && <p className={styles.error}>{errors.username.message}</p>}

        <label className={styles.label}>
          Avatar URL
          <input type="url" {...register('avatar')} className={styles.input} />
        </label>
        {errors.avatar && <p className={styles.error}>{errors.avatar.message}</p>}

        {serverError && <p className={styles.error}>{serverError}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <section className={styles.danger}>
        <h2 className={styles.dangerHeading}>Danger zone</h2>
        <p className={styles.dangerText}>
          Deleting your account is permanent and cannot be undone.
        </p>
        {deleteError && <p className={styles.error}>{deleteError}</p>}
        <Button
          variant="danger"
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting…' : 'Delete account'}
        </Button>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Delete account"
        message="This will permanently delete your account. This cannot be undone."
        confirmLabel="Delete account"
        variant="danger"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default Settings;
