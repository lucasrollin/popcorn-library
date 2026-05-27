import { z } from 'zod';
import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { getMe, login, register } from '../controllers/authController';
import { authenticate } from '../middlewares/authenticate';
const router = Router();

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string(),
});

router.get('/me', authenticate, getMe);
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;
