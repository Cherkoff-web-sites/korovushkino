import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDER_FILE = path.join(DATA_DIR, "product-order.json");

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function productUrlSlug(product) {
  const slug = String(product?.urlSlug || product?.id || "").trim();
  return slug || product.id;
}

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;

  const count = await query("SELECT COUNT(*)::int AS count FROM products");
  if (Number(count.rows[0]?.count || 0) > 0) {
    seeded = true;
    return;
  }

  const products = await readJson(PRODUCTS_FILE, {});
  let order = await readJson(ORDER_FILE, null);
  if (!Array.isArray(order) || order.length === 0) {
    order = Object.keys(products);
  }

  const orderedIds = [...order, ...Object.keys(products).filter((id) => !order.includes(id))];
  for (const [index, id] of orderedIds.entries()) {
    const product = products[id];
    if (!product?.id) continue;
    await query(
      `INSERT INTO products (id, url_slug, sort_order, data)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [product.id, productUrlSlug(product), index, JSON.stringify(product)]
    );
  }

  seeded = true;
}

function rowToProduct(row) {
  return row?.data ? row.data : null;
}

let productsCache = null;
let productsCacheAt = 0;
const PRODUCTS_CACHE_TTL_MS = 15_000;

export function invalidateProductsCache() {
  productsCache = null;
  productsCacheAt = 0;
}

export function isDataImageUrl(value) {
  return typeof value === "string" && value.startsWith("data:image/");
}

export function catalogImageUrl(productId, index = 0) {
  return `/api/products/${encodeURIComponent(productId)}/image/${index}`;
}

/** Lightweight card for public catalog grid — no base64 blobs in JSON. */
export function toCatalogCard(product) {
  if (!product?.id) return null;
  const images = Array.isArray(product.images) ? product.images : [];
  const main = String(images[0] || "").trim();
  const resolvedImage = !main
    ? "/images/home/hero-bg.png"
    : isDataImageUrl(main)
      ? catalogImageUrl(product.id, 0)
      : main;

  const teaser =
    String(product.catalogCardTeaser || "").trim() ||
    String(product.briefDescription || "").trim() ||
    String(product.description || "").trim().slice(0, 160);

  return {
    id: product.id,
    name: product.name,
    series: product.series,
    category: product.category,
    categorySlug: product.categorySlug,
    price: product.price,
    description: String(product.description || "").slice(0, 400),
    briefDescription: product.briefDescription || "",
    catalogCardTeaser: teaser,
    modalNutrition: product.modalNutrition || undefined,
    urlSlug: product.urlSlug || product.id,
    images: [resolvedImage],
    imageAlts: Array.isArray(product.imageAlts) && product.imageAlts[0]
      ? [product.imageAlts[0]]
      : [product.name],
    breadcrumbs: Array.isArray(product.breadcrumbs) ? product.breadcrumbs : [],
  };
}

export function parseDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

export async function getProductImage(idOrSlug, index = 0) {
  const product = await getProduct(idOrSlug);
  if (!product) return null;
  const images = Array.isArray(product.images) ? product.images : [];
  const src = String(images[index] || images[0] || "").trim();
  if (!src) return null;
  if (isDataImageUrl(src)) {
    return parseDataUrl(src);
  }
  return { redirectTo: src };
}

export async function getProductsRecord() {
  const products = await listProducts();
  return Object.fromEntries(products.map((product) => [product.id, product]));
}

export async function getProductOrder() {
  await ensureSeeded();
  const result = await query("SELECT id FROM products ORDER BY sort_order ASC, created_at ASC, id ASC");
  return result.rows.map((row) => row.id);
}

export async function listProducts({ bypassCache = false } = {}) {
  await ensureSeeded();
  const now = Date.now();
  if (!bypassCache && productsCache && now - productsCacheAt < PRODUCTS_CACHE_TTL_MS) {
    return productsCache;
  }
  const result = await query("SELECT data FROM products ORDER BY sort_order ASC, created_at ASC, id ASC");
  const products = result.rows.map(rowToProduct).filter(Boolean);
  productsCache = products;
  productsCacheAt = now;
  return products;
}

export async function listCatalogCards() {
  const products = await listProducts();
  return products.map(toCatalogCard).filter(Boolean);
}

export async function getProduct(idOrSlug) {
  await ensureSeeded();
  const result = await query(
    `SELECT data FROM products
     WHERE id = $1 OR url_slug = $1 OR data->>'urlSlug' = $1
     ORDER BY sort_order ASC
     LIMIT 1`,
    [idOrSlug]
  );
  return rowToProduct(result.rows[0]);
}

export async function createProduct(product) {
  await ensureSeeded();
  const exists = await query("SELECT id FROM products WHERE id = $1", [product.id]);
  if (exists.rowCount > 0) {
    throw new Error("Товар с таким ID уже существует");
  }

  const order = await query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM products");
  await query(
    `INSERT INTO products (id, url_slug, sort_order, data)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [product.id, productUrlSlug(product), Number(order.rows[0]?.next_order || 0), JSON.stringify(product)]
  );
  invalidateProductsCache();
  return product;
}

export async function updateProduct(id, product) {
  await ensureSeeded();
  const current = await query("SELECT sort_order FROM products WHERE id = $1", [id]);
  if (current.rowCount === 0) {
    throw new Error("Товар не найден");
  }

  if (product.id !== id) {
    const duplicate = await query("SELECT id FROM products WHERE id = $1", [product.id]);
    if (duplicate.rowCount > 0) {
      throw new Error("Товар с таким ID уже существует");
    }
    await query("DELETE FROM products WHERE id = $1", [id]);
    await query(
      `INSERT INTO products (id, url_slug, sort_order, data)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [
        product.id,
        productUrlSlug(product),
        Number(current.rows[0]?.sort_order || 0),
        JSON.stringify(product),
      ]
    );
    invalidateProductsCache();
    return product;
  }

  await query(
    `UPDATE products
     SET url_slug = $2, data = $3::jsonb, updated_at = NOW()
     WHERE id = $1`,
    [id, productUrlSlug(product), JSON.stringify(product)]
  );
  invalidateProductsCache();
  return product;
}

export async function deleteProduct(id) {
  await ensureSeeded();
  const removed = await query("DELETE FROM products WHERE id = $1", [id]);
  if (removed.rowCount === 0) {
    throw new Error("Товар не найден");
  }
  invalidateProductsCache();
}

export async function replaceCatalog(productsRecord, order) {
  await query("DELETE FROM products");
  const ids = Array.isArray(order) ? order : Object.keys(productsRecord);
  const orderedIds = [...ids, ...Object.keys(productsRecord).filter((id) => !ids.includes(id))];

  for (const [index, id] of orderedIds.entries()) {
    const product = productsRecord[id];
    if (!product?.id) continue;
    await query(
      `INSERT INTO products (id, url_slug, sort_order, data)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [product.id, productUrlSlug(product), index, JSON.stringify(product)]
    );
  }
  seeded = true;
  invalidateProductsCache();
  return { products: productsRecord, order: orderedIds };
}
