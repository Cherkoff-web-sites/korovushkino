import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import { query } from "./db.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - start}ms)`
    );
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.sendStatus(200);
});

app.use("/api/auth", authRoutes);

async function ensureSchema() {
  try {
    const initPath = path.join(__dirname, "..", "sql", "init.sql");
    const sql = fs.readFileSync(initPath, "utf8");
    await query(sql);
    console.log("Database schema ensured");
  } catch (err) {
    console.error("Failed to ensure schema:", err.message);
  }
}

const port = Number(process.env.PORT) || 4000;
const dbDisabled = (process.env.DB_DISABLED || "").toLowerCase() === "true";

if (dbDisabled) {
  console.warn("DB_DISABLED=true — auth routes disabled");
  app.use("/api/auth", (_req, res) => {
    res.status(503).json({ error: "База данных временно недоступна" });
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

if (!dbDisabled) {
  ensureSchema().catch((err) => {
    console.error("Database bootstrap failed:", err.message);
  });
}
