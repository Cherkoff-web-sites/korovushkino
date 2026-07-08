import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";
import productRoutes, { adminRouter as adminProductRoutes } from "./productRoutes.js";
import siteRoutes, { adminRouter as adminSiteRoutes } from "./siteRoutes.js";
import { query } from "./db.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, "..", "public");
const hasStaticFrontend = fs.existsSync(staticDir);

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

if (hasStaticFrontend) {
  app.use(express.static(staticDir));
  console.log("Static files dir:", staticDir);
}

app.get("/api/health", (_req, res) => {
  res.sendStatus(200);
});

const dbDisabled = (process.env.DB_DISABLED || "").toLowerCase() === "true";

if (dbDisabled) {
  console.warn("DB_DISABLED=true — auth routes disabled");
  app.use("/api/auth", (_req, res) => {
    res.status(503).json({ error: "База данных временно недоступна" });
  });
} else {
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/admin", adminAuthRoutes);
}

app.use("/api", productRoutes);
app.use("/api", siteRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminSiteRoutes);

if (hasStaticFrontend) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    const normalized = req.path.endsWith("/") ? req.path : `${req.path}/`;
    const indexPath = path.join(staticDir, normalized, "index.html");
    const htmlPath = path.join(staticDir, `${req.path.replace(/\/$/, "")}.html`);

    res.sendFile(indexPath, (err) => {
      if (!err) return;
      res.sendFile(htmlPath, (htmlErr) => {
        if (!htmlErr) return;
        res.sendFile(path.join(staticDir, "index.html"), (fallbackErr) => {
          if (fallbackErr) next(fallbackErr);
        });
      });
    });
  });
}

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

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});

if (!dbDisabled) {
  ensureSchema().catch((err) => {
    console.error("Database bootstrap failed:", err.message);
  });
}
