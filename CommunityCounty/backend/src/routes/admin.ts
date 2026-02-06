import { Router } from "express";
import { db } from "../db/memory";
import requireAuth from "../middleware/requireAuth";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

router.use(requireAuth, requireAdmin);

// Admin: users list
router.get("/users", (req, res) => {
  const users = [...db.users.values()]
    .filter((u) => u.role !== "admin")
    .map((u) => db.safeUser(u));
  return res.json({ users });
});

// Admin: user token history
router.get("/users/:id/transactions", (req, res) => {
  const userId = req.params.id;
  const tx = db.listUserTransactions(userId).map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    created_date: t.createdAt,
  }));
  return res.json({ transactions: tx });
});

// Admin: adjust tokens
router.post("/users/:id/adjust-tokens", (req, res) => {
  try {
    const userId = req.params.id;
    const { amount, description } = req.body || {};
    if (typeof amount !== "number" || !description) {
      return res.status(400).json({ error: "amount(number) and description are required" });
    }
    const tx = db.addTokens(userId, amount, "admin_adjustment", String(description));
    return res.json({ transaction: tx });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Adjust failed" });
  }
});

// Admin: event registrations
router.get("/events/:id/registrations", (req, res) => {
  const eventId = req.params.id;
  const regs = db.listEventRegistrations(eventId).map((r) => {
    const u = db.getUserById(r.userId);
    return {
      id: r.id,
      status: r.status,
      registered_at: r.registeredAt,
      attended_at: r.attendedAt || null,
      user: u ? db.safeUser(u) : null,
    };
  });
  return res.json({ registrations: regs });
});

export default router;

