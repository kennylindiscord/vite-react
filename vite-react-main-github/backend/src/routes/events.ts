// backend/src/routes/events.ts
import { Router, Request, Response } from 'express';
import {
  events,
  addTokenTransaction,
  registerForEvent,
} from '../data/store';

const router = Router();

// GET /api/events?status=upcoming&limit=3
router.get('/', (req: Request, res: Response) => {
  const { status, limit } = req.query;

  let result = [...events].sort((a, b) =>
    a.event_date.localeCompare(b.event_date),
  );

  if (typeof status === 'string') {
    result = result.filter((e) => e.status === status);
  }

  if (typeof limit === 'string') {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n)) {
      result = result.slice(0, n);
    }
  }

  res.json(result);
});

// GET /api/events/:id
router.get('/:id', (req: Request, res: Response) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  return res.json(event);
});

// POST /api/events/:id/register
// body: { userEmail: string }
router.post('/:id/register', (req: Request, res: Response) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { userEmail } = req.body as { userEmail?: string };
  if (!userEmail) {
    return res.status(400).json({ error: 'userEmail is required' });
  }

  const registration = registerForEvent({
    eventId: event.id,
    userEmail,
  });

  const transaction = addTokenTransaction({
    user_email: userEmail,
    amount: event.tokens_reward,
    type: 'event_attendance',
    description: event.title,
  });

  return res.status(201).json({
    registration,
    transaction,
  });
});

export default router;

