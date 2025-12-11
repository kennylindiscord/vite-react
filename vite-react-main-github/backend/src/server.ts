// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';
import tokensRouter from './routes/tokens';
import communityRouter from './routes/community';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routers
app.use('/api/events', eventsRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/community', communityRouter);

// 404 for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

