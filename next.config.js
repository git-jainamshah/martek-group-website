/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: false,
  },
  async redirects() {
    return [
      // Landing pages live under /lp/* so they are easy to identify.
      { source: '/launch', destination: '/lp/launch', permanent: true },
      { source: '/landing-page/launch', destination: '/lp/launch', permanent: true },
    ]
  },
}

module.exports = nextConfig
