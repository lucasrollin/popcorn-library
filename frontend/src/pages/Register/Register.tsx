import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerService } from '../../services/authService';
import Button from '../../components/Button/Button';
import styles from '../../styles/authForm.module.scss';

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const user = await registerService(data);
      setUser(user);
      navigate('/');
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.heading}>Register</h1>

      <label className={styles.label}>
        Email
        <input type="email" autoComplete="email" {...register('email')} className={styles.input} />
      </label>

      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <label className={styles.label}>
        Username
        <input type="text" autoComplete="username" {...register('username')} className={styles.input} />
      </label>

      {errors.username && <p className={styles.error}>{errors.username.message}</p>}

      <label className={styles.label}>
        Password
        <input
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className={styles.input}
        />
      </label>

      {errors.password && <p className={styles.error}>{errors.password.message}</p>}

      {serverError && <p className={styles.error}>{serverError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering…' : 'Register'}
      </Button>
    </form>
  );
}
