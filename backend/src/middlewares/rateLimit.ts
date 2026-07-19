import rateLimit from 'express-rate-limit';

// Applied to the sensitive auth routes (login, register) to slow brute-force
// and account-enumeration attempts. Keyed by client IP.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // max attempts per IP per window
  standardHeaders: true, // expose RateLimit-* headers
  legacyHeaders: false, // drop the deprecated X-RateLimit-* headers
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many attempts, please try again later.',
  },
});

// General backstop applied to the whole /api surface. Generous enough that
// a human browsing the app never hits it, but stops scripted abuse — mainly
// looping on the public TMDB search proxy to burn our API quota.
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.',
  },
});
