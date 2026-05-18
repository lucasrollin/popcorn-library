import { Request, Response } from 'express';
import {
  register as registerService,
  RegisterInput,
} from '../services/authService';

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) => {
  const user = await registerService(req.body);
  res.status(201).json(user);
};
