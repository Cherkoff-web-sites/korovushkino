/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,

  // Оптимизация для SEO
  compress: true,

  // Оптимизация изображений (static export)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },

  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return []
    }

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
