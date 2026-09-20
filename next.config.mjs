/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.js",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
      { protocol: "https", hostname: "*.shopifycdn.com" },
    ],
  },
  typedRoutes: true,
  serverExternalPackages: ["sharp", "@mediapipe/tasks-vision"],
};

export default nextConfig;
