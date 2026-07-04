import { Request, Response } from 'express';
import { z } from 'zod';
import {
  deleteAccountService,
  getPublicProfileService,
  updateProfileService,
} from '../services/userService.js';

export const getPublicProfileController = async (req: Request, res: Response) => {
  const schema = z.object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/),
  });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Username is invalid',
    });

    return;
  }

  const profile = await getPublicProfileService(result.data.username);

  res.json(profile);
};

export const updateProfileController = async (req: Request, res: Response) => {
  const updated = await updateProfileService(req.user!.id, req.body);
  res.json(updated);
};

export const deleteAccountController = async (req: Request, res: Response) => {
  await deleteAccountService(req.user!.id);
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(204).end();
};
