/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    unoptimized: false, // Enable Image Optimization for Netlify Image CDN
  },
  // Enable deployment ID for skew protection on Netlify
  experimental: {
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
  },
}

export default nextConfig
