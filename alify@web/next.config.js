/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: "/api/:path*",
      destination: "http://localhost:1488/api/:path*"
    }]
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'ik.imagekit.io',
      port: '',
      pathname: '/sujkmwsrb/**'
    }]
  }
}

module.exports = nextConfig