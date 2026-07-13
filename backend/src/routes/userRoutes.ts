import { Router } from 'express';
import {
  deleteAccountController,
  getPublicProfileController,
  updateProfileController,
} from '../controllers/userController.js';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

const updateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  avatar: z.url({ protocol: /^https?$/ }).nullable().optional(),
});

router.patch('/me', authenticate, validateBody(updateProfileSchema), updateProfileController);
router.delete('/me', authenticate, deleteAccountController);
router.get('/:username', getPublicProfileController);

export default router;
