import type { NextConfig } from "next";

// Provider photos are served by the API host, so next/image must be allowed to load from it.
const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.quickfiss.com");

const nextConfig: NextConfig = {
  images: {
    // Lets the dev server optimize images from a local API (e.g. 127.0.0.1). Never enabled in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
