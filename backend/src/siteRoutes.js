import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { query } from "./db.js";
import { sendNewsletterWelcomeEmail } from "./mailer.js";
import {
  appendNewsletterSubscriber,
  appendOrder,
  appendReview,
  deleteReview,
  getDeliverySettings,
  listNewsletterSubscribers,
  listOrders,
  listReviews,
  saveDeliverySettings,
  updateReview,
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

router.get("/orders/mine", authMiddleware, async (req, res) => {
  try {
    const email = String(req.user?.email || req.user?.login || "")
      .trim()
      .toLowerCase();
    if (!email) {
      return res.json({ orders: [] });
    }
    const orders = await listOrders();
    const mine = orders.filter((order) => String(order.email || "").trim().toLowerCase() === email);
    return res.json({ orders: mine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить заказы" });
  }
});

router.post("/reviews", authMiddleware, async (req, res) => {
  const body = req.body || {};
  const email = String(req.user?.email || req.user?.login || "").trim().toLowerCase();

  if (!body.text || !body.productLabel) {
    return res.status(400).json({ error: "Заполните отзыв" });
  }

  try {
    const review = {
      id: String(body.id || `review-${Date.now()}`),
      authorEmail: email,
      authorName: String(body.authorName || req.user?.login || "Покупатель"),
      productId: String(body.productId || ""),
      productLabel: String(body.productLabel || ""),
      orderId: body.orderId ? String(body.orderId) : undefined,
      date: String(body.date || new Date().toLocaleDateString("ru-RU")),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      text: String(body.text || "").trim(),
      status: "pending",
      replyText: "",
      replyDate: "",
    };

    const saved = await appendReview(review);
    return res.json({ ok: true, review: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить отзыв" });
  }
});

router.get("/reviews/published", async (_req, res) => {
  try {
    const reviews = await listReviews();
    const published = reviews.filter((item) => item.status === "approved");
    return res.json({ reviews: published });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить отзывы" });
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

adminRouter.get("/reviews", async (_req, res) => {
  try {
    const reviews = await listReviews();
    return res.json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить отзывы" });
  }
});

adminRouter.patch("/reviews/:id", async (req, res) => {
  const id = String(req.params.id || "");
  const status = String(req.body?.status || "");
  const allowed = new Set(["pending", "approved", "rejected"]);

  if (!id || !allowed.has(status)) {
    return res.status(400).json({ error: "Некорректные данные модерации" });
  }

  try {
    const patch = {
      status,
      replyText: String(req.body?.replyText || ""),
      replyDate:
        status === "approved"
          ? new Date().toLocaleDateString("ru-RU")
          : String(req.body?.replyDate || ""),
    };
    const updated = await updateReview(id, patch);
    if (!updated) {
      return res.status(404).json({ error: "Отзыв не найден" });
    }
    return res.json({ ok: true, review: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось обновить отзыв" });
  }
});

adminRouter.delete("/reviews/:id", async (req, res) => {
  const id = String(req.params.id || "");
  if (!id) {
    return res.status(400).json({ error: "Укажите id отзыва" });
  }

  try {
    const removed = await deleteReview(id);
    if (!removed) {
      return res.status(404).json({ error: "Отзыв не найден" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось удалить отзыв" });
  }
});

adminRouter.get("/clients", async (_req, res) => {
  try {
    const orders = await listOrders();
    const orderCountByEmail = {};
    for (const order of orders) {
      const email = String(order.email || "").trim().toLowerCase();
      if (!email) continue;
      orderCountByEmail[email] = (orderCountByEmail[email] || 0) + 1;
    }

    const result = await query(
      `SELECT id, login, email, role, surname, first_name, phone, created_at
       FROM users
       WHERE COALESCE(role, 'user') <> 'admin'
       ORDER BY created_at DESC`
    );

    const clients = result.rows.map((row) => {
      const email = row.email || row.login || "";
      const emailKey = String(email).trim().toLowerCase();
      const name = [row.surname, row.first_name].filter(Boolean).join(" ").trim();
      return {
        id: String(row.id),
        email,
        name: name || "—",
        phone: row.phone || "—",
        registeredAt: row.created_at
          ? new Date(row.created_at).toLocaleString("ru-RU")
          : "—",
        ordersCount: orderCountByEmail[emailKey] || 0,
        status: "Активен",
      };
    });

    return res.json({ clients });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить клиентов" });
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
