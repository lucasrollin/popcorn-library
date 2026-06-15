import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/Button/Button';
import styles from '../../styles/authForm.module.scss';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(data);
      setUser(user);
      navigate('/');
    } catch (err) {
      setServerError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h1 className={styles.heading}>Login</h1>

      <label className={styles.label}>
        Email
        <input type="email" autoComplete="email" {...register('email')} className={styles.input} />
      </label>

      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <label className={styles.label}>
        Password
        <input
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className={styles.input}
        />
      </label>
      {errors.password && <p className={styles.error}>{errors.password.message}</p>}

      {serverError && <p className={styles.error}>{serverError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in…' : 'Login'}
      </Button>
    </form>
  );
}
