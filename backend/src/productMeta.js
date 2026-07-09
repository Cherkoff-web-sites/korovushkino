export const CATEGORY_LABELS = {
  dairy: "Молочная продукция",
  meat: "Мясо",
  cheese: "Сыры",
  poultry: "Птица",
  "meat-products": "Мясная продукция",
  honey: "Мед",
  fish: "Рыба",
  "semi-finished": "Полуфабрикаты",
};

export function isCategorySlug(value) {
  return typeof value === "string" && value in CATEGORY_LABELS;
}

export function productBreadcrumbs(productName, categorySlug) {
  return [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    {
      label: CATEGORY_LABELS[categorySlug],
      href: `/catalog?category=${categorySlug}`,
    },
    { label: productName, href: "#", active: true },
  ];
}

export function slugifyId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeProduct(body, existingId) {
  const id = existingId || slugifyId(body.id || body.name);
  const categorySlug = String(body.categorySlug || "").trim();

  if (!id) {
    throw new Error("Укажите ID или название товара");
  }
  if (!isCategorySlug(categorySlug)) {
    throw new Error("Выберите категорию");
  }

  const name = String(body.name || "").trim();
  const series = String(body.series || "").trim();
  const price = Number(body.price);
  const description = String(body.description || "").trim();

  if (!name || !series || !Number.isFinite(price) || price < 0 || !description) {
    throw new Error("Заполните название, серию, цену и описание");
  }

  const images = Array.isArray(body.images)
    ? body.images.map((item) => String(item).trim()).filter(Boolean)
    : String(body.images || "")
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

  const modalNutrition =
    body.modalNutrition &&
    (body.modalNutrition.macrosPer100g || body.modalNutrition.kcal)
      ? {
          macrosPer100g: String(body.modalNutrition.macrosPer100g || "").trim(),
          kcal: String(body.modalNutrition.kcal || "").trim(),
        }
      : undefined;

  const descriptionBlocks = Array.isArray(body.descriptionBlocks)
    ? body.descriptionBlocks
        .map((item) => ({
          type: ["p", "h2", "h3"].includes(item?.type) ? item.type : "p",
          text: String(item?.text || "").trim(),
        }))
        .filter((item) => item.text)
    : undefined;

  const imageAlts = Array.isArray(body.imageAlts)
    ? body.imageAlts.map((item) => String(item || "").trim())
    : undefined;

  const parametersTable = Array.isArray(body.parametersTable)
    ? body.parametersTable
        .map((table) => ({
          title: String(table?.title || "").trim(),
          headers: Array.isArray(table?.headers)
            ? table.headers.map((item) => String(item || "").trim())
            : [],
          rows: Array.isArray(table?.rows)
            ? table.rows.map((row) =>
                Array.isArray(row) ? row.map((cell) => String(cell || "").trim()) : []
              )
            : [],
        }))
        .filter((table) => table.title || table.headers.length || table.rows.length)
    : undefined;

  const seoTitle = String(body.seo?.title || "").trim();
  const seoDescription = String(body.seo?.description || "").trim();
  const seoKeywords = String(body.seo?.keywords || "").trim();
  const seo =
    seoTitle || seoDescription || seoKeywords
      ? {
          title: seoTitle || undefined,
          description: seoDescription || undefined,
          keywords: seoKeywords || undefined,
        }
      : undefined;

  return {
    id,
    name,
    series,
    category: CATEGORY_LABELS[categorySlug],
    categorySlug,
    price,
    description,
    descriptionBlocks,
    briefDescription: String(body.briefDescription || "").trim(),
    catalogCardTeaser: String(body.catalogCardTeaser || "").trim() || undefined,
    modalNutrition,
    images: images.length > 0 ? images : ["/images/home/hero-bg.png"],
    imageAlts,
    breadcrumbs: productBreadcrumbs(name, categorySlug),
    urlSlug: slugifyId(body.urlSlug || body.id || id) || id,
    seo,
    advantages: Array.isArray(body.advantages)
      ? body.advantages.map((item) => String(item).trim()).filter(Boolean)
      : undefined,
    parametersTable,
  };
}
