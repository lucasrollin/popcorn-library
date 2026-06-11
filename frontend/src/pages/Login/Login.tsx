import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import styles from './Login.module.scss';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string(),
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
      <input type="email" placeholder="Email" {...register('email')} className={styles.input} />
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register('password')}
        className={styles.input}
      />
      {errors.password && <p className={styles.error}>{errors.password.message}</p>}

      {serverError && <p className={styles.error}>{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
