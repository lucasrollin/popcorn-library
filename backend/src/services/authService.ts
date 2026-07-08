import argon2 from 'argon2';
import { ConflictError } from '../errors/ConflictError.js';
import { findUserByEmail, findUserByUsername, createUser } from '../repositories/userRepository.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { generateToken, hashToken } from '../utils/sessionToken.js';
import { createSession, deleteSessionByTokenHash } from '../repositories/sessionRepository.js';
import { Prisma } from '../generated/prisma/client.js';
import { toUserResponse } from './userService.js';
import { config } from '../config.js';

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export const register = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser)
    throw new ConflictError('EMAIL_ALREADY_TAKEN', 'This email is already registered');

  const userWithUsername = await findUserByUsername(data.username);

  if (userWithUsername)
    throw new ConflictError('USERNAME_ALREADY_TAKEN', 'This username is already taken');

  const passwordHash = await argon2.hash(data.password);

  let newUser;
  try {
    newUser = await createUser({
      email: data.email,
      username: data.username,
      password: passwordHash,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target;
      if (Array.isArray(target) && target.includes('email')) {
        throw new ConflictError('EMAIL_ALREADY_TAKEN', 'This email is already registered');
      }
      if (Array.isArray(target) && target.includes('username')) {
        throw new ConflictError('USERNAME_ALREADY_TAKEN', 'This username is already taken');
      }
    }
    throw error;
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const days = config.SESSION_EXPIRES_IN_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await createSession({
    userId: newUser.id,
    tokenHash,
    expiresAt,
  });

  return { user: toUserResponse(newUser), token: rawToken, expiresAt };
};

export type LoginInput = {
  email: string;
  password: string;
};

// Valid argon2id hash of a throwaway password, used to equalize response time
// when the email is unknown — otherwise skipping argon2.verify would leak
// (via timing) which emails are registered.
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$/QOdNsrQ8UZyg5KdVfr/qg$Ea/ERdeQ1++fLx/MFFUDvvMpRYBierNmACIBONxeI2A';

export const loginUser = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);

  const passwordIsValid = user
    ? await argon2.verify(user.password, data.password)
    : await argon2.verify(DUMMY_PASSWORD_HASH, data.password);

  if (!user || !passwordIsValid) {
    throw new UnauthorizedError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const days = config.SESSION_EXPIRES_IN_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await createSession({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  return { user: toUserResponse(user), token: rawToken, expiresAt };
};

export const logout = async (tokenHash: string) => {
  await deleteSessionByTokenHash(tokenHash);
};
