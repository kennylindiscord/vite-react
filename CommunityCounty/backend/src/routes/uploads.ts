import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth";
import { db } from "../db/memory";
import { id } from "../utils/ids";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", requireAuth, upload.single("file"), (req, res) => {
  const auth = (req as any).auth as { uid: string };
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const up = {
    id: id("upl"),
    mime: req.file.mimetype,
    data: req.file.buffer,
    createdBy: auth.uid,
    createdDate: new Date().toISOString()
  };

  db.uploads.push(up);
  return res.json({ id: up.id, url: `/api/uploads/${up.id}` });
});

router.get("/:id", (req, res) => {
  const up = db.uploads.find(u => u.id === req.params.id);
  if (!up) return res.status(404).send("Not found");
  res.setHeader("Content-Type", up.mime);
  return res.send(up.data);
});

export default router;

