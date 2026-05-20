import { z } from 'zod';
import { Router } from 'express';
import { validateBody } from '../middlewares/validate';
import { register } from '../controllers/authController';

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

const router = Router();

router.post('/register', validateBody(registerSchema), register);

export default router;
