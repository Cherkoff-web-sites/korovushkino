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

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig

