import { Request, Response } from 'express';
import { z } from 'zod';
import { getPublicProfileService, updateProfileService } from '../services/userService';

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
