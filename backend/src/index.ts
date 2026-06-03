import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/authRoutes';
import filmRouter from './routes/filmRoutes';
import listRouter from './routes/listRoutes';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/films', filmRouter);
app.use('/api/lists', listRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
