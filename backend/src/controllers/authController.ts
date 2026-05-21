import { Request, Response } from 'express';
import {
  register as registerService,
  RegisterInput,
  LoginInput,
  loginUser as loginService,
} from '../services/authService';

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) => {
  const user = await registerService(req.body);
  res.status(201).json(user);
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  const { user, token } = await loginService(req.body);

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(user);
};
