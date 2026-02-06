import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { db } from "../db/memory";

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    const user = db.getUserById(decoded.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    (req as any).user = user; // attach
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

