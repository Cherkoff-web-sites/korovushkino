import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { generateSitemapXml, getSeoSettings, regenerateSitemap, saveSeoSettings } from "./seoStore.js";

const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/", async (_req, res) => {
  try {
    const settings = await getSeoSettings();
    return res.json({ settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить SEO-настройки" });
  }
});

adminRouter.put("/", async (req, res) => {
  try {
    const settings = await saveSeoSettings(req.body?.settings ?? req.body);
    return res.json({ settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить SEO-настройки" });
  }
});

adminRouter.post("/regenerate-sitemap", async (_req, res) => {
  try {
    const settings = await regenerateSitemap();
    const sitemapXml = await generateSitemapXml(settings.siteUrl);
    return res.json({ settings, sitemapXml });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось обновить sitemap" });
  }
});

export { adminRouter };
export default adminRouter;
