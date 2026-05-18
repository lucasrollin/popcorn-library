import argon2 from 'argon2';
import { ConflictError } from '../errors/ConflictError';
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from '../repositories/userRepository';

type RegisterInput = {
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
