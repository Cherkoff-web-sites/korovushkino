import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { query } from "./db.js";
import { sendNewsletterWelcomeEmail } from "./mailer.js";
import {
  appendNewsletterSubscriber,
  appendContact,
  appendOrder,
  appendReview,
  backupSection,
  deleteReview,
  exportSiteData,
  getDeliverySettings,
  getSiteContent,
  listContacts,
  listNewsletterSubscribers,
  listOrders,
  listReviews,
  replaceClients,
  restoreSiteData,
  saveDeliverySettings,
  saveSiteContent,
  updateOrder,
  updateReview,
  upsertClientProfile,
} from "./siteDataStore.js";
import { getProductOrder, listProducts, replaceCatalog } from "./productsStore.js";
import { getSeoSettings, saveSeoSettings } from "./seoStore.js";

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

router.get("/content/:section", async (req, res) => {
  const section = String(req.params.section || "").trim();
  const allowed = new Set(["home", "pages", "site", "delivery"]);
  if (!allowed.has(section)) {
    return res.status(400).json({ error: "Некорректный раздел контента" });
  }
  try {
    const content = section === "delivery" ? await getDeliverySettings() : await getSiteContent(section, null);
    return res.json({ section, content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить контент" });
  }
});

router.get("/orders/mine", authMiddleware, async (req, res) => {
  try {
    const identities = new Set(
      [req.user?.email, req.user?.login]
        .map((value) => String(value || "").trim().toLowerCase())
        .filter(Boolean)
    );
    if (!identities.size) {
      return res.json({ orders: [] });
    }
    const orders = await listOrders();
    const mine = orders.filter((order) =>
      identities.has(String(order.email || "").trim().toLowerCase())
    );
    return res.json({ orders: mine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить заказы" });
  }
});

router.post("/clients/sync", authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, login, email, surname, first_name, phone
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const row = result.rows[0];
    const email = row.email || row.login || "";
    const name = [row.surname, row.first_name].filter(Boolean).join(" ").trim();

    await upsertClientProfile({
      email,
      name: name || "—",
      phone: row.phone || "—",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось синхронизировать профиль клиента" });
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

router.get("/reviews/mine", authMiddleware, async (req, res) => {
  try {
    const email = String(req.user?.email || req.user?.login || "").trim().toLowerCase();
    const reviews = await listReviews();
    const mine = reviews.filter((item) => String(item.authorEmail || "").trim().toLowerCase() === email);
    return res.json({ reviews: mine });
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

adminRouter.patch("/orders/:id", async (req, res) => {
  const id = String(req.params.id || "");
  const status = String(req.body?.status || "").trim();
  const allowed = new Set(["Новый", "В работе", "Собран", "Доставлен"]);

  if (!id || !allowed.has(status)) {
    return res.status(400).json({ error: "Некорректный статус заказа" });
  }

  try {
    const updated = await updateOrder(id, { status });
    if (!updated) {
      return res.status(404).json({ error: "Заказ не найден" });
    }
    return res.json({ ok: true, order: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось обновить заказ" });
  }
});

adminRouter.get("/contacts", async (_req, res) => {
  try {
    const contacts = await listContacts();
    return res.json({ contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить обращения" });
  }
});

adminRouter.post("/contacts", async (req, res) => {
  try {
    const saved = await appendContact(req.body || {});
    return res.json({ contact: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить обращение" });
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
    const clients = await listClients();
    return res.json({ clients });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить клиентов" });
  }
});

async function listClients() {
  const result = await query(
    `SELECT
       users.id,
       users.login,
       users.email,
       users.role,
       users.surname,
       users.first_name,
       users.phone,
       users.created_at,
       COUNT(orders.id)::int AS orders_count
     FROM users
     LEFT JOIN orders ON LOWER(orders.email) = LOWER(COALESCE(NULLIF(users.email, ''), users.login))
     WHERE LOWER(COALESCE(users.role, 'user')) <> 'admin'
     GROUP BY users.id
     ORDER BY users.created_at DESC NULLS LAST, users.id DESC`
  );

  return result.rows.map((row) => {
    const email = row.email || row.login || "";
    const name = [row.surname, row.first_name].filter(Boolean).join(" ").trim();
    return {
      id: String(row.id),
      email,
      name: name || "—",
      phone: row.phone || "—",
      registeredAt: row.created_at ? new Date(row.created_at).toLocaleString("ru-RU") : "—",
      ordersCount: Number(row.orders_count || 0),
      status: "Активен",
    };
  });
}

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

adminRouter.get("/content/:section", async (req, res) => {
  const section = String(req.params.section || "").trim();
  const allowed = new Set(["home", "pages", "site", "delivery"]);
  if (!allowed.has(section)) {
    return res.status(400).json({ error: "Некорректный раздел контента" });
  }
  try {
    const content = section === "delivery" ? await getDeliverySettings() : await getSiteContent(section, null);
    return res.json({ section, content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить контент" });
  }
});

adminRouter.put("/content/:section", async (req, res) => {
  const section = String(req.params.section || "").trim();
  const allowed = new Set(["home", "pages", "site", "delivery"]);
  if (!allowed.has(section)) {
    return res.status(400).json({ error: "Некорректный раздел контента" });
  }
  try {
    const content = req.body?.content ?? req.body;
    const saved =
      section === "delivery" ? await saveDeliverySettings(content) : await saveSiteContent(section, content);
    return res.json({ section, content: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось сохранить контент" });
  }
});

async function buildBackupPayload(section) {
  const [products, order, siteData, clients] = await Promise.all([
    listProducts(),
    getProductOrder(),
    exportSiteData(),
    listClients(),
  ]);
  const full = {
    version: 5,
    exportedAt: new Date().toISOString(),
    products,
    order,
    clients,
    orders: siteData.orders,
    reviews: siteData.reviews,
    newsletter: siteData.newsletter,
    contacts: siteData.contacts,
    content: siteData.content,
    deliverySettings: siteData.deliverySettings,
    seo: await getSeoSettings(),
  };

  if (!section) return full;
  if (section === "products") return { section, products, order };
  if (section === "clients") return { section, clients };
  if (section === "delivery") return { section, deliverySettings: siteData.deliverySettings };
  if (section === "seo") return { section, seo: await getSeoSettings() };
  return { section, [section]: await backupSection(section) };
}

async function restoreBackupPayload(payload, section) {
  const data = payload?.section && payload[payload.section] !== undefined ? payload : payload || {};
  const target = section || payload?.section || "";

  if (!target || target === "products") {
    const products = Array.isArray(data.products) ? data.products : [];
    const record = Object.fromEntries(products.map((product) => [product.id, product]));
    await replaceCatalog(record, data.order || products.map((product) => product.id));
  }
  if (!target || target === "clients") {
    await replaceClients(data.clients || []);
  }
  if (!target || target === "seo") {
    if (data.seo) await saveSeoSettings(data.seo);
  }
  await restoreSiteData(data, target || undefined);
  return buildBackupPayload();
}

adminRouter.get("/backup", async (_req, res) => {
  try {
    return res.json(await buildBackupPayload());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось выгрузить резервную копию" });
  }
});

adminRouter.get("/backup/:section", async (req, res) => {
  try {
    return res.json(await buildBackupPayload(String(req.params.section || "")));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось выгрузить раздел" });
  }
});

adminRouter.post("/backup/import", async (req, res) => {
  try {
    const backup = await restoreBackupPayload(req.body || {});
    return res.json({ ok: true, backup });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось импортировать резервную копию" });
  }
});

adminRouter.post("/backup/import/:section", async (req, res) => {
  try {
    const backup = await restoreBackupPayload(req.body || {}, String(req.params.section || ""));
    return res.json({ ok: true, backup });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось импортировать раздел" });
  }
});

export { adminRouter };
export default router;
