import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDER_FILE = path.join(DATA_DIR, "product-order.json");

let cache = null;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function loadStore() {
  if (cache) return cache;

  await ensureDataDir();
  const products = await readJson(PRODUCTS_FILE, {});
  let order = await readJson(ORDER_FILE, null);

  if (!Array.isArray(order) || order.length === 0) {
    order = Object.keys(products);
  }

  cache = { products, order };
  return cache;
}

async function persistStore(store) {
  await ensureDataDir();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(store.products, null, 2), "utf8");
  await fs.writeFile(ORDER_FILE, JSON.stringify(store.order, null, 2), "utf8");
  cache = store;
}

export async function getProductsRecord() {
  const store = await loadStore();
  return store.products;
}

export async function getProductOrder() {
  const store = await loadStore();
  return store.order;
}

export async function listProducts() {
  const store = await loadStore();
  return store.order.map((id) => store.products[id]).filter(Boolean);
}

export async function getProduct(id) {
  const store = await loadStore();
  return store.products[id] || null;
}

export async function createProduct(product) {
  const store = await loadStore();
  if (store.products[product.id]) {
    throw new Error("Товар с таким ID уже существует");
  }

  store.products[product.id] = product;
  store.order.push(product.id);
  await persistStore(store);
  return product;
}

export async function updateProduct(id, product) {
  const store = await loadStore();
  if (!store.products[id]) {
    throw new Error("Товар не найден");
  }

  if (product.id !== id) {
    delete store.products[id];
    store.order = store.order.map((itemId) => (itemId === id ? product.id : itemId));
  }

  store.products[product.id] = product;
  await persistStore(store);
  return product;
}

export async function deleteProduct(id) {
  const store = await loadStore();
  if (!store.products[id]) {
    throw new Error("Товар не найден");
  }

  delete store.products[id];
  store.order = store.order.filter((itemId) => itemId !== id);
  await persistStore(store);
}

export async function replaceCatalog(productsRecord, order) {
  const store = {
    products: productsRecord,
    order: Array.isArray(order) ? order : Object.keys(productsRecord),
  };
  await persistStore(store);
  return store;
}
