import { describe, it, expect } from 'vitest';
import { generateToken, hashToken } from './sessionToken';

describe('hashToken', () => {
  it('matches the known SHA-256 digest of the empty string', () => {
    expect(hashToken('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('is deterministic for the same input', () => {
    const first = hashToken('my-token');
    const second = hashToken('my-token');
    expect(first).toBe(second);
  });

  it('returns 64 lowercase hex characters', () => {
    expect(hashToken('anything')).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('generateToken', () => {
  it('returns 64 lowercase hex characters', () => {
    const result = generateToken();
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns a different value each call', () => {
    expect(generateToken()).not.toBe(generateToken());
  });
});
