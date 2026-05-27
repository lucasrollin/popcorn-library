import argon2 from 'argon2';
import { ConflictError } from '../errors/ConflictError';
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from '../repositories/userRepository';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { generateToken, hashToken } from '../utils/sessionToken';
import {
  createSession,
  deleteSessionByTokenHash,
} from '../repositories/sessionRepository';

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export const register = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser)
    throw new ConflictError(
      'EMAIL_ALREADY_TAKEN',
      'This email is already registered',
    );

  const userWithUsername = await findUserByUsername(data.username);

  if (userWithUsername)
    throw new ConflictError(
      'USERNAME_ALREADY_TAKEN',
      'This username is already taken',
    );

  const passwordHash = await argon2.hash(data.password);

  const newUser = await createUser({
    email: data.email,
    username: data.username,
    password: passwordHash,
  });

  const { password: _password, ...rest } = newUser;

  return rest;
};

export type LoginInput = {
  email: string;
  password: string;
};

export const loginUser = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError(
      'INVALID_CREDENTIALS',
      'Invalid email or password',
    );
  }

  const passwordIsValid = await argon2.verify(user.password, data.password);

  if (!passwordIsValid) {
    throw new UnauthorizedError(
      'INVALID_CREDENTIALS',
      'Invalid email or password',
    );
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await createSession({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const { password: _password, ...rest } = user;

  return { user: rest, token: rawToken };
};

export const logout = async (tokenHash: string) => {
  await deleteSessionByTokenHash(tokenHash);
};
