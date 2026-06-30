import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");

const ordersFile = path.join(dataDir, "orders.json");
const newsletterFile = path.join(dataDir, "newsletter.json");
const deliveryFile = path.join(dataDir, "delivery.json");

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

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true });
  for (const [file, fallback] of [
    [ordersFile, []],
    [newsletterFile, []],
    [deliveryFile, DEFAULT_DELIVERY],
  ]) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify(fallback, null, 2), "utf8");
    }
  }
}

async function readJson(file, fallback) {
  await ensureDataFiles();
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function writeJson(file, data) {
  await ensureDataFiles();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function listOrders() {
  return readJson(ordersFile, []);
}

export async function appendOrder(order) {
  const items = await listOrders();
  items.unshift(order);
  await writeJson(ordersFile, items);
  return order;
}

export async function listNewsletterSubscribers() {
  return readJson(newsletterFile, []);
}

export async function appendNewsletterSubscriber(entry) {
  const items = await listNewsletterSubscribers();
  const exists = items.some(
    (item) => String(item.email || "").toLowerCase() === String(entry.email || "").toLowerCase()
  );
  if (exists) {
    return { duplicate: true };
  }
  items.unshift(entry);
  await writeJson(newsletterFile, items);
  return { duplicate: false };
}

export async function getDeliverySettings() {
  return readJson(deliveryFile, DEFAULT_DELIVERY);
}

export async function saveDeliverySettings(settings) {
  await writeJson(deliveryFile, settings);
  return settings;
}
