import { config } from './config.js';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import filmRouter from './routes/filmRoutes.js';
import listRouter from './routes/listRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Behind nginx: trust the first proxy hop so req.ip reflects the real client
// (from X-Forwarded-For) instead of nginx's container IP — required for
// per-client rate limiting.
app.set('trust proxy', 1);

const PORT = config.PORT;

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/films', filmRouter);
app.use('/api/lists', listRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
