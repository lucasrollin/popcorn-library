import { createHash, randomBytes } from 'node:crypto';

export const generateToken = () => {
  return randomBytes(32).toString('hex');
};

export const hashToken = (raw: string) => {
  return createHash('sha256').update(raw).digest('hex');
};
