import { Request, Response } from 'express';
import {
  deleteAccountService,
  getPublicProfileService,
  updateProfileService,
} from '../services/userService.js';
import { SESSION_COOKIE_OPTIONS } from '../utils/sessionCookie.js';

export const getPublicProfileController = async (
  req: Request<{ username: string }>,
  res: Response,
) => {
  const profile = await getPublicProfileService(req.params.username);

  res.json(profile);
};

export const updateProfileController = async (req: Request, res: Response) => {
  const updated = await updateProfileService(req.user!.id, req.body);
  res.json(updated);
};

export const deleteAccountController = async (req: Request, res: Response) => {
  await deleteAccountService(req.user!.id);
  res.clearCookie('session', SESSION_COOKIE_OPTIONS);

  res.status(204).end();
};
