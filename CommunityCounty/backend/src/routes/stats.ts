import { Router } from "express";
import { db } from "../db/memory";

const router = Router();

router.get("/", (req, res) => {
  return res.json(db.getStats());
});

export default router;

