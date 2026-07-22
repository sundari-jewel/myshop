/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  typedRoutes: true,
  serverExternalPackages: ["sharp", "@mediapipe/tasks-vision"],
};

export default nextConfig;
