import { z } from 'zod';
import { Router } from 'express';
import { validateBody } from '../middlewares/validate.js';
import { getMe, login, logout, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authRateLimiter } from '../middlewares/rateLimit.js';

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
  password: z.string().max(128),
});

router.post('/register', authRateLimiter, validateBody(registerSchema), register);
router.post('/login', authRateLimiter, validateBody(loginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
