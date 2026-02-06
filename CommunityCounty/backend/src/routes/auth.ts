import { Router } from "express";
import { db } from "../db/memory";
import { signToken } from "../lib/jwt";
import requireAuth from "../middleware/requireAuth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name } = req.body || {};
    const user = await db.createUser({ email, password, fullName: full_name, role: "resident" });
    const token = signToken({ userId: user.id });
    return res.json({ token, user: db.safeUser(user) });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Register failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await db.verifyUser(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({ userId: user.id });
    return res.json({ token, user: db.safeUser(user) });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Login failed" });
  }
});

router.get("/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  return res.json({ user: db.safeUser(user) });
});

router.patch("/me", requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { full_name, neighborhood, phone, bio } = req.body || {};
    const updated = db.updateUserProfile(user.id, {
      fullName: full_name,
      neighborhood,
      phone,
      bio,
    });
    return res.json({ user: db.safeUser(updated) });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Update failed" });
  }
});

export default router;

