import { getSiteContent, saveSiteContent } from "./siteDataStore.js";
import { listProducts } from "./productsStore.js";

const SEO_SECTION = "seo";

const STATIC_PATHS = [
  "/",
  "/catalog/",
  "/about/",
  "/contact/",
  "/delivery-payment/",
  "/baskets/",
];

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://korovushkino.com/sitemap.xml
`;

export function getDefaultSeoSettings(siteUrl = "https://korovushkino.com") {
  const base = siteUrl.replace(/\/+$/, "");
  return {
    siteUrl: base,
    robotsTxt: DEFAULT_ROBOTS_TXT.replace("https://korovushkino.com", base),
    sitemapMode: "auto",
    sitemapXml: "",
    redirects: [],
  };
}

function productPath(product) {
  const slug = String(product?.urlSlug || product?.id || "").trim();
  return slug ? `/catalog/${slug}/` : null;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizePath(path) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  if (withSlash === "/") return "/";
  return withSlash.replace(/\/+$/, "");
}

export async function getSeoSettings() {
  const stored = await getSiteContent(SEO_SECTION, null);
  if (!stored) {
    return getDefaultSeoSettings();
  }
  return {
    ...getDefaultSeoSettings(stored.siteUrl),
    ...stored,
    redirects: Array.isArray(stored.redirects) ? stored.redirects : [],
  };
}

export async function saveSeoSettings(patch) {
  const current = await getSeoSettings();
  const next = {
    ...current,
    ...patch,
    redirects: Array.isArray(patch?.redirects) ? patch.redirects : current.redirects,
  };
  await saveSiteContent(SEO_SECTION, next);
  return next;
}

export async function generateSitemapXml(siteUrl) {
  const base = String(siteUrl || "https://korovushkino.com").replace(/\/+$/, "");
  const products = await listProducts();
  const urls = new Set(STATIC_PATHS);

  for (const product of products) {
    const path = productPath(product);
    if (path) urls.add(path);
    const reviewsPath = path ? `${path}reviews/` : null;
    if (reviewsPath) urls.add(reviewsPath);
  }

  const body = Array.from(urls)
    .sort()
    .map((path) => {
      const loc = `${base}${path === "/" ? "/" : path}`;
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export async function getRobotsTxt() {
  const settings = await getSeoSettings();
  return String(settings.robotsTxt || DEFAULT_ROBOTS_TXT).trim() + "\n";
}

export async function getSitemapXml() {
  const settings = await getSeoSettings();
  if (settings.sitemapMode === "manual" && String(settings.sitemapXml || "").trim()) {
    return String(settings.sitemapXml).trim() + "\n";
  }
  return generateSitemapXml(settings.siteUrl);
}

export async function regenerateSitemap() {
  const settings = await getSeoSettings();
  const sitemapXml = await generateSitemapXml(settings.siteUrl);
  const next = await saveSeoSettings({
    sitemapMode: "auto",
    sitemapXml,
  });
  return next;
}

export async function findRedirect(pathname) {
  const settings = await getSeoSettings();
  const current = normalizePath(pathname);
  if (!current) return null;

  for (const item of settings.redirects || []) {
    const from = normalizePath(item.from);
    const to = String(item.to || "").trim();
    if (!from || !to) continue;
    if (from === current) {
      return {
        to: to.startsWith("http") ? to : to.startsWith("/") ? to : `/${to}`,
        permanent: item.permanent !== false,
      };
    }
  }
  return null;
}
