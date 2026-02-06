import { Router } from "express";
import { db } from "../db/memory";
import requireAuth from "../middleware/requireAuth";

const router = Router();

router.get("/balance", requireAuth, (req, res) => {
  const user = (req as any).user;
  return res.json({ token_balance: user.tokenBalance });
});

router.get("/transactions", requireAuth, (req, res) => {
  const user = (req as any).user;
  const tx = db.listUserTransactions(user.id).map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    created_date: t.createdAt,
  }));
  return res.json({ transactions: tx });
});

// Tokens page needs participation history
router.get("/participation", requireAuth, (req, res) => {
  const user = (req as any).user;
  const regs = db.listUserRegistrations(user.id).map((r) => {
    const ev = db.getEvent(r.eventId);
    return {
      id: r.id,
      status: r.status,
      registered_at: r.registeredAt,
      attended_at: r.attendedAt || null,
      event: ev
        ? {
            id: ev.id,
            title: ev.title,
            event_date: ev.eventDate,
            tokens_reward: ev.tokensReward,
            location: ev.location || "",
          }
        : null,
    };
  });
  return res.json({ participation: regs });
});

export default router;

