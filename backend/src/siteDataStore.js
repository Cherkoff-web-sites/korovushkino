import { query } from "./db.js";

const DEFAULT_DELIVERY = {
  moscowRegionPrice: 500,
  moscowDefaultPrice: 400,
  outsideMoscowPrice: null,
  moscowDistricts: [
    { id: "cao", name: "Центральный (ЦАО)", price: 400 },
    { id: "sao", name: "Северный (САО)", price: 450 },
    { id: "svao", name: "Северо-Восточный (СВАО)", price: 450 },
    { id: "vao", name: "Восточный (ВАО)", price: 450 },
    { id: "uvao", name: "Юго-Восточный (ЮВАО)", price: 450 },
    { id: "uao", name: "Южный (ЮАО)", price: 450 },
    { id: "uzao", name: "Юго-Западный (ЮЗАО)", price: 450 },
    { id: "zao", name: "Западный (ЗАО)", price: 450 },
    { id: "szao", name: "Северо-Западный (СЗАО)", price: 450 },
    { id: "zelao", name: "Зеленоградский (ЗелАО)", price: 500 },
    { id: "tinao", name: "Троицкий и Новомосковский (ТиНАО)", price: 550 },
  ],
  moscowKeywords: ["москва"],
  regionKeywords: [
    "московская",
    "подмосков",
    "химки",
    "мытищ",
    "балаших",
    "люберц",
    "одинцов",
    "красногорск",
    "королёв",
    "королев",
  ],
};

function rowData(row) {
  return row?.data || null;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeStatus(value, fallback = "Новый") {
  return String(value || fallback).trim();
}

export async function getSiteContent(section, fallback = null) {
  const result = await query("SELECT data FROM site_content WHERE section = $1", [section]);
  return rowData(result.rows[0]) ?? fallback;
}

export async function saveSiteContent(section, data) {
  await query(
    `INSERT INTO site_content (section, data)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (section) DO UPDATE
     SET data = EXCLUDED.data, updated_at = NOW()`,
    [section, JSON.stringify(data)]
  );
  return data;
}

export async function listOrders() {
  const result = await query("SELECT data FROM orders ORDER BY created_at DESC, id DESC");
  return result.rows.map(rowData).filter(Boolean);
}

export async function appendOrder(order) {
  const id = String(order?.id || `ord-${Date.now()}`);
  const data = { ...order, id, status: normalizeStatus(order?.status) };
  await query(
    `INSERT INTO orders (id, email, status, data)
     VALUES ($1, $2, $3, $4::jsonb)
     ON CONFLICT (id) DO UPDATE
     SET email = EXCLUDED.email,
         status = EXCLUDED.status,
         data = EXCLUDED.data,
         updated_at = NOW()`,
    [id, normalizeEmail(data.email), data.status, JSON.stringify(data)]
  );
  return data;
}

export async function updateOrder(id, patch) {
  const result = await query("SELECT data FROM orders WHERE id = $1", [id]);
  const current = rowData(result.rows[0]);
  if (!current) return null;

  const next = {
    ...current,
    ...patch,
    id: String(current.id || id),
    status: patch?.status ? normalizeStatus(patch.status) : normalizeStatus(current.status),
  };

  return appendOrder(next);
}

export async function replaceOrders(items) {
  await query("DELETE FROM orders");
  for (const item of Array.isArray(items) ? items : []) {
    await appendOrder(item);
  }
  return listOrders();
}

export async function listContacts() {
  const result = await query("SELECT data FROM contact_leads ORDER BY created_at DESC, id DESC");
  return result.rows.map(rowData).filter(Boolean);
}

export async function appendContact(contact) {
  const id = String(contact?.id || `contact-${Date.now()}`);
  const data = { ...contact, id };
  await query(
    `INSERT INTO contact_leads (id, email, data)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (id) DO UPDATE
     SET email = EXCLUDED.email,
         data = EXCLUDED.data,
         updated_at = NOW()`,
    [id, normalizeEmail(data.email), JSON.stringify(data)]
  );
  return data;
}

export async function replaceContacts(items) {
  await query("DELETE FROM contact_leads");
  for (const item of Array.isArray(items) ? items : []) {
    await appendContact(item);
  }
  return listContacts();
}

export async function replaceNewsletterSubscribers(items) {
  await query("DELETE FROM newsletter_subscribers");
  for (const item of Array.isArray(items) ? items : []) {
    await appendNewsletterSubscriber(item);
  }
  return listNewsletterSubscribers();
}

export async function replaceReviews(items) {
  await query("DELETE FROM reviews");
  for (const item of Array.isArray(items) ? items : []) {
    await appendReview(item);
  }
  return listReviews();
}

export async function listContentSections() {
  const result = await query("SELECT section, data FROM site_content ORDER BY section ASC");
  return Object.fromEntries(result.rows.map((row) => [row.section, row.data]));
}

export async function replaceContentSections(content) {
  await query("DELETE FROM site_content");
  const entries = content && typeof content === "object" ? Object.entries(content) : [];
  for (const [section, data] of entries) {
    await saveSiteContent(section, data);
  }
  return listContentSections();
}

export async function exportSiteData() {
  const [orders, newsletter, reviews, contacts, content, deliverySettings] = await Promise.all([
    listOrders(),
    listNewsletterSubscribers(),
    listReviews(),
    listContacts(),
    listContentSections(),
    getDeliverySettings(),
  ]);
  return { orders, newsletter, reviews, contacts, content, deliverySettings };
}

export async function restoreSiteData(data, section) {
  if (!section || section === "orders") await replaceOrders(data.orders || (Array.isArray(data) ? data : []));
  if (!section || section === "newsletter") {
    await replaceNewsletterSubscribers(data.newsletter || data.subscribers || (Array.isArray(data) ? data : []));
  }
  if (!section || section === "reviews") await replaceReviews(data.reviews || (Array.isArray(data) ? data : []));
  if (!section || section === "contacts") await replaceContacts(data.contacts || (Array.isArray(data) ? data : []));
  if (!section || section === "content") await replaceContentSections(data.content || data);
  if (!section || section === "delivery") {
    await saveDeliverySettings(data.deliverySettings || data.settings || data || DEFAULT_DELIVERY);
  }
  return exportSiteData();
}

export async function upsertClientProfile(client) {
  const email = normalizeEmail(client?.email);
  if (!email) return null;
  const name = String(client?.name || "").trim();
  const [surname = "", ...rest] = name === "—" ? [""] : name.split(/\s+/);
  const firstName = rest.join(" ");
  const result = await query(
    `INSERT INTO users (login, email, surname, first_name, phone)
     VALUES ($1, $1, $2, $3, $4)
     ON CONFLICT (login) DO UPDATE
     SET email = EXCLUDED.email,
         surname = COALESCE(NULLIF(EXCLUDED.surname, ''), users.surname),
         first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), users.first_name),
         phone = COALESCE(NULLIF(EXCLUDED.phone, ''), users.phone),
         updated_at = NOW()
     RETURNING id`,
    [email, surname, firstName, String(client?.phone || "").replace(/^—$/, "")]
  );
  return result.rows[0] || null;
}

export async function replaceClients(clients) {
  for (const client of Array.isArray(clients) ? clients : []) {
    await upsertClientProfile(client);
  }
}

export async function restoreBackupData(data, section) {
  if (!section || section === "products") {
    // Products are restored in productRoutes to avoid a circular dependency.
  }
  if (!section || section === "clients") await replaceClients(data.clients || []);
  await restoreSiteData(data, section);
  return exportSiteData();
}

export async function backupSection(section) {
  const data = await exportSiteData();
  if (!section) return data;
  if (section === "delivery") return data.deliverySettings;
  return data[section];
}

export async function listNewsletterSubscribers() {
  const result = await query("SELECT data FROM newsletter_subscribers ORDER BY created_at DESC");
  return result.rows.map(rowData).filter(Boolean);
}

export async function appendNewsletterSubscriber(entry) {
  const email = normalizeEmail(entry?.email);
  if (!email) return { duplicate: false };

  const data = {
    id: String(entry.id || `sub-${Date.now()}`),
    ...entry,
    email,
  };
  const result = await query(
    `INSERT INTO newsletter_subscribers (email, data)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (email) DO NOTHING`,
    [email, JSON.stringify(data)]
  );
  return { duplicate: result.rowCount === 0 };
}

export async function getDeliverySettings() {
  return getSiteContent("delivery", DEFAULT_DELIVERY);
}

export async function saveDeliverySettings(settings) {
  await saveSiteContent("delivery", settings);
  return settings;
}

export async function listReviews() {
  const result = await query("SELECT data FROM reviews ORDER BY created_at DESC, id DESC");
  return result.rows.map(rowData).filter(Boolean);
}

export async function appendReview(review) {
  const id = String(review?.id || `review-${Date.now()}`);
  const status = String(review?.status || "pending");
  const data = { ...review, id, status };
  await query(
    `INSERT INTO reviews (id, status, product_id, author_email, data)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     ON CONFLICT (id) DO UPDATE
     SET status = EXCLUDED.status,
         product_id = EXCLUDED.product_id,
         author_email = EXCLUDED.author_email,
         data = EXCLUDED.data,
         updated_at = NOW()`,
    [
      id,
      status,
      String(data.productId || ""),
      normalizeEmail(data.authorEmail),
      JSON.stringify(data),
    ]
  );
  return data;
}

export async function updateReview(id, patch) {
  const result = await query("SELECT data FROM reviews WHERE id = $1", [id]);
  const current = rowData(result.rows[0]);
  if (!current) return null;
  const next = { ...current, ...patch };
  await appendReview(next);
  return next;
}

export async function deleteReview(id) {
  const result = await query("DELETE FROM reviews WHERE id = $1", [id]);
  return result.rowCount > 0;
}
