/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    unoptimized: false, // Enable Image Optimization for Netlify Image CDN
  },
}

export default nextConfig
