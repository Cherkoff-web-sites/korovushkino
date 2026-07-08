import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { sendNewsletterWelcomeEmail } from "./mailer.js";
import {
  appendNewsletterSubscriber,
  appendOrder,
  getDeliverySettings,
  listNewsletterSubscribers,
  listOrders,
  saveDeliverySettings,
} from "./siteDataStore.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  const order = req.body;
  if (!order || !order.email || !order.name) {
    return res.status(400).json({ error: "Некорректные данные заказа" });
  }

  try {
    const saved = await appendOrder(order);
    return res.json({ ok: true, order: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить заказ" });
  }
});

router.post("/newsletter", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const source = String(req.body?.source || "footer").trim();

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Укажите корректный email" });
  }

  try {
    const entry = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toLocaleString("ru-RU"),
      source,
    };
    const result = await appendNewsletterSubscriber(entry);
    if (!result.duplicate) {
      try {
        await sendNewsletterWelcomeEmail(email);
      } catch (mailErr) {
        console.error("Newsletter welcome email failed:", mailErr);
      }
    }
    return res.json({ ok: true, duplicate: result.duplicate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить подписчика" });
  }
});

router.get("/delivery/settings", async (_req, res) => {
  try {
    const settings = await getDeliverySettings();
    return res.json({ settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить настройки доставки" });
  }
});

const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/orders", async (_req, res) => {
  try {
    const orders = await listOrders();
    return res.json({ orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить заказы" });
  }
});

adminRouter.get("/newsletter", async (_req, res) => {
  try {
    const subscribers = await listNewsletterSubscribers();
    return res.json({ subscribers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить подписчиков" });
  }
});

adminRouter.get("/delivery/settings", async (_req, res) => {
  try {
    const settings = await getDeliverySettings();
    return res.json({ settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить настройки доставки" });
  }
});

adminRouter.put("/delivery/settings", async (req, res) => {
  try {
    const settings = await saveDeliverySettings(req.body?.settings ?? req.body);
    return res.json({ settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить настройки доставки" });
  }
});

export { adminRouter };
export default router;
