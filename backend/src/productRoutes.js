import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { normalizeProduct, slugifyId } from "./productMeta.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductImage,
  getProductOrder,
  listCatalogCards,
  listProducts,
  toCatalogCard,
  updateProduct,
} from "./productsStore.js";

const router = express.Router();

/** Public catalog list — lightweight cards without base64 payloads. */
router.get("/products", async (_req, res) => {
  try {
    const [products, order] = await Promise.all([listCatalogCards(), getProductOrder()]);
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    return res.json({ products, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить каталог" });
  }
});

/** Serve product image (data URL from DB → binary with long cache). */
router.get("/products/:id/image/:index", async (req, res) => {
  try {
    const index = Math.max(0, Number(req.params.index) || 0);
    const image = await getProductImage(req.params.id, index);
    if (!image) {
      return res.status(404).json({ error: "Изображение не найдено" });
    }
    if (image.redirectTo) {
      res.set("Cache-Control", "public, max-age=300");
      return res.redirect(302, image.redirectTo);
    }
    res.set({
      "Content-Type": image.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": String(image.buffer.length),
    });
    return res.send(image.buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить изображение" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    // Keep full product for page view, but rewrite data-URL images to cacheable endpoints
    // so the HTML/JSON response stays small when possible for multi-image products.
    const images = Array.isArray(product.images)
      ? product.images.map((src, index) => {
          const value = String(src || "").trim();
          if (!value) return "/images/home/hero-bg.png";
          if (value.startsWith("data:image/")) {
            return `/api/products/${encodeURIComponent(product.id)}/image/${index}`;
          }
          return value;
        })
      : [];

    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    return res.json({
      product: {
        ...product,
        images: images.length ? images : ["/images/home/hero-bg.png"],
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить товар" });
  }
});

const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/products", async (_req, res) => {
  try {
    // Admin always gets full product payloads (including data URLs for editing).
    const [products, order] = await Promise.all([listProducts({ bypassCache: true }), getProductOrder()]);
    return res.json({ products, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить каталог" });
  }
});

adminRouter.get("/products/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    return res.json({ product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить товар" });
  }
});

adminRouter.post("/products", async (req, res) => {
  try {
    const product = normalizeProduct(req.body || {});
    const created = await createProduct(product);
    return res.status(201).json({ product: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Не удалось создать товар";
    return res.status(400).json({ error: message });
  }
});

adminRouter.put("/products/:id", async (req, res) => {
  try {
    const product = normalizeProduct(req.body || {}, req.params.id);
    const updated = await updateProduct(req.params.id, product);
    return res.json({ product: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Не удалось обновить товар";
    const status = message === "Товар не найден" ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

adminRouter.delete("/products/:id", async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Не удалось удалить товар";
    const status = message === "Товар не найден" ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

adminRouter.post("/products/suggest-id", (req, res) => {
  const id = slugifyId(req.body?.name || req.body?.id || "");
  return res.json({ id });
});

export { adminRouter, toCatalogCard };
export default router;
