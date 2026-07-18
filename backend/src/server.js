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
import { adminRouter as adminSeoRoutes } from "./seoRoutes.js";
import { findRedirect, getRobotsTxt, getSitemapXml } from "./seoStore.js";
import { query } from "./db.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = path.join(__dirname, "..", "public");
const hasStaticFrontend = fs.existsSync(staticDir);

app.use(cors());
// Product/content saves embed images as base64 data URLs — default 100kb is too small.
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

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

app.get("/robots.txt", async (_req, res) => {
  try {
    const body = await getRobotsTxt();
    res.type("text/plain").send(body);
  } catch (err) {
    console.error(err);
    res.status(500).type("text/plain").send("User-agent: *\nDisallow:\n");
  }
});

app.get("/sitemap.xml", async (_req, res) => {
  try {
    const body = await getSitemapXml();
    res.type("application/xml").send(body);
  } catch (err) {
    console.error(err);
    res.status(500).type("application/xml").send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

app.use(async (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }
  if (req.path.startsWith("/api") || req.path === "/robots.txt" || req.path === "/sitemap.xml") {
    return next();
  }
  try {
    const redirect = await findRedirect(req.path);
    if (!redirect) return next();
    return res.redirect(redirect.permanent ? 301 : 302, redirect.to);
  } catch (err) {
    console.error(err);
    return next();
  }
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
app.use("/api/admin/seo", adminSeoRoutes);

if (hasStaticFrontend) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    const normalized = req.path.endsWith("/") ? req.path : `${req.path}/`;
    const indexPath = path.join(staticDir, normalized, "index.html");
    const htmlPath = path.join(staticDir, `${req.path.replace(/\/$/, "")}.html`);
    const catalogProductMatch = req.path.replace(/\/+$/, "").match(/^\/catalog\/([^/]+)(\/reviews)?$/);
    const catalogFallbackPath = catalogProductMatch
      ? path.join(
          staticDir,
          "catalog",
          "__product__",
          catalogProductMatch[2] ? "reviews" : "",
          "index.html"
        )
      : null;

    res.sendFile(indexPath, (err) => {
      if (!err) return;
      if (catalogFallbackPath) {
        return res.sendFile(catalogFallbackPath, (fallbackErr) => {
          if (!fallbackErr) return;
          res.sendFile(htmlPath, (htmlErr) => {
            if (!htmlErr) return;
            res.sendFile(path.join(staticDir, "index.html"), (rootErr) => {
              if (rootErr) next(rootErr);
            });
          });
        });
      }
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

async function start() {
  if (!dbDisabled) {
    await ensureSchema();
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Backend listening on http://0.0.0.0:${port}`);
  });
}

start().catch((err) => {
  console.error("Backend startup failed:", err.message);
  process.exit(1);
});
