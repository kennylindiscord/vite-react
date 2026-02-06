import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import communityRouter from "./routes/community";
import tokensRouter from "./routes/tokens";
import statsRouter from "./routes/stats";
import adminRouter from "./routes/admin";

import { seedAdmin } from "./db/memory";

async function main() {
  await seedAdmin();

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/community", communityRouter);
  app.use("/api/tokens", tokensRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/admin", adminRouter);

  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log("Seeded admin => email: admin@county.local  password: Admin123!");
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

