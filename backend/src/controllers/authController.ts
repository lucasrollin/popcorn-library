import { Request, Response } from 'express';
import {
  register as registerService,
  RegisterInput,
  LoginInput,
  loginUser as loginService,
  logout as logoutService,
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
  const { user, token, expiresAt } = await loginService(req.body);

  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresAt.getTime() - Date.now(),
  });

  res.status(200).json(user);
};

export const getMe = async (req: Request, res: Response) => {
  const user = req.user;
  res.json(user);
};

export const logout = async (req: Request, res: Response) => {
  await logoutService(req.sessionTokenHash!);
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.status(204).end();
};
