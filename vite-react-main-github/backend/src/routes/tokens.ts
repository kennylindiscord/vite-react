// backend/src/routes/tokens.ts
import { Router, Request, Response } from 'express';
import { tokenTransactions } from '../data/store';

const router = Router();

// GET /api/tokens/transactions?userEmail=demo.resident@example.com
router.get('/transactions', (req: Request, res: Response) => {
  const { userEmail } = req.query;

  if (!userEmail || typeof userEmail !== 'string') {
    return res.status(400).json({ error: 'userEmail query parameter is required' });
  }

  const items = tokenTransactions
    .filter((tx) => tx.user_email === userEmail)
    .sort((a, b) => b.created_date.localeCompare(a.created_date));

  return res.json(items);
});

export default router;

