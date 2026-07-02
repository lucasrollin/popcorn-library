import { Router } from 'express';
import { getPublicProfileController, updateProfileController } from '../controllers/userController';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  avatar: z.string().url().nullable().optional(),
});

router.patch('/me', authenticate, validateBody(updateProfileSchema), updateProfileController);
router.get('/:username', getPublicProfileController);

export default router;
