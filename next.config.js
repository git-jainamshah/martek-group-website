/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: false,
  },
  async redirects() {
    return [
      // Landing pages live under /landing-page/* so they are easy to identify.
      { source: '/launch', destination: '/landing-page/launch', permanent: true },
    ]
  },
}

module.exports = nextConfig
