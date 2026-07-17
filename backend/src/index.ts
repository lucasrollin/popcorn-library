import { config } from './config.js';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import filmRouter from './routes/filmRoutes.js';
import listRouter from './routes/listRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import { deleteExpiredSessions } from './repositories/sessionRepository.js';
import { apiRateLimiter } from './middlewares/rateLimit.js';

const app = express();

// Behind nginx: trust the first proxy hop so req.ip reflects the real client
// (from X-Forwarded-For) instead of nginx's container IP — required for
// per-client rate limiting.
app.set('trust proxy', 1);

const PORT = config.PORT;

// Security headers on every API response (nosniff, frame denial, no
// X-Powered-By…) — the SPA's HTML gets its own headers from nginx.
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Registered after /api/health (healthchecks stay unlimited) and before the
// routers so every API route below is covered.
app.use('/api', apiRateLimiter);

app.use('/api/auth', authRouter);
app.use('/api/films', filmRouter);
app.use('/api/lists', listRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});

// One-off housekeeping at boot: drop sessions that expired while the server
// was down (lazy per-request deletion never reaches abandoned tokens).
deleteExpiredSessions()
  .then((count) => console.log(`purged ${count} expired session(s)`))
  .catch((err) => console.error('failed to purge expired sessions:', err));
