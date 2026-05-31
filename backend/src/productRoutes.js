import express from "express";
import { authMiddleware, adminMiddleware } from "./authRoutes.js";
import { normalizeProduct, slugifyId } from "./productMeta.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductOrder,
  getProductsRecord,
  listProducts,
  updateProduct,
} from "./productsStore.js";

const router = express.Router();

router.get("/products", async (_req, res) => {
  try {
    const [products, order] = await Promise.all([listProducts(), getProductOrder()]);
    return res.json({ products, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Не удалось загрузить каталог" });
  }
});

router.get("/products/:id", async (req, res) => {
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

const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/products", async (_req, res) => {
  try {
    const [products, order] = await Promise.all([listProducts(), getProductOrder()]);
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

export { adminRouter };
export default router;
