import { Router } from "express";
import { z } from "zod";
import {
  createEvent,
  createRegistration,
  db,
  listEvents,
  markAttended,
  addTokenTx,
  getUserBalance
} from "../db/memory";
import { requireAuth, requireRole, AuthedRequest } from "../middleware/auth";

const router = Router();

router.get("/", (req, res) => {
  const status = String(req.query.status || "");
  const limit = Number(req.query.limit || 0);

  let items = listEvents();
  if (status) items = items.filter((e) => e.status === status);

  if (limit > 0) items = items.slice(0, limit);
  return res.json({ events: items });
});

router.get("/me/participation", requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;

  const regs = Array.from(db.registrations.values())
    .filter((r) => r.userId === userId)
    .sort((a, b) => (b.attendedAt || b.registeredAt).localeCompare(a.attendedAt || a.registeredAt));

  const result = regs.map((r) => ({
    ...r,
    event: db.events.get(r.eventId) || null
  }));

  return res.json({ participation: result });
});

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  eventDate: z.string().min(1), // ISO
  category: z.string().min(1),
  imageUrl: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  tokensReward: z.number().int().nonnegative(),
  status: z.enum(["upcoming", "completed"]).default("upcoming")
});

router.post("/", requireAuth, requireRole("admin"), (req: AuthedRequest, res) => {
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const e = createEvent({
    ...parsed.data,
    createdBy: req.user!.id
  });

  return res.json({ event: e });
});

router.post("/:id/register", requireAuth, (req: AuthedRequest, res) => {
  const user = req.user!;

  // Admin should NOT participate
  if (user.role === "admin") {
    return res.status(403).json({ error: "Admins cannot register for events" });
  }

  const event = db.events.get(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.status !== "upcoming") return res.status(400).json({ error: "Event is not open" });

  const reg = createRegistration(event.id, user.id);
  return res.json({ registration: reg });
});

// Check-in: user marks themselves attended -> grants tokens
router.post("/:id/checkin", requireAuth, (req: AuthedRequest, res) => {
  const user = req.user!;
  if (user.role === "admin") {
    return res.status(403).json({ error: "Admins cannot check in" });
  }

  const event = db.events.get(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (event.status !== "upcoming") return res.status(400).json({ error: "Event is not open" });

  const reg = markAttended(event.id, user.id);
  if (!reg) return res.status(400).json({ error: "You must register before check-in" });

  // Grant tokens only once
  if (reg.attendedAt) {
    addTokenTx({
      userId: user.id,
      amount: event.tokensReward,
      type: "event_attendance",
      description: event.title,
      meta: { eventId: event.id }
    });
  }

  return res.json({ registration: reg, tokenBalance: getUserBalance(user.id) });
});

// Admin can force-attend a user (for future admin check-in flow)
const adminAttendSchema = z.object({ userId: z.string().min(1) });

router.post("/:id/attend", requireAuth, requireRole("admin"), (req: AuthedRequest, res) => {
  const parsed = adminAttendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const event = db.events.get(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const { userId } = parsed.data;
  const target = db.users.get(userId);
  if (!target) return res.status(404).json({ error: "User not found" });
  if (target.role === "admin") return res.status(400).json({ error: "Admin cannot attend" });

  const reg = markAttended(event.id, target.id);
  if (!reg) return res.status(400).json({ error: "User must be registered first" });

  // Grant tokens
  addTokenTx({
    userId: target.id,
    amount: event.tokensReward,
    type: "event_attendance",
    description: event.title,
    meta: { eventId: event.id, attendedBy: req.user!.id }
  });

  return res.json({ registration: reg, newBalance: getUserBalance(target.id) });
});

export default router;

