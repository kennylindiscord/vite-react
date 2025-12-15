// src/index.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

