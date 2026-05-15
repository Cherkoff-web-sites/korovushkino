/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Оптимизация для SEO
  compress: true,

  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig

