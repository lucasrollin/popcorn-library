import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});
