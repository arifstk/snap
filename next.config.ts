import type { NextConfig } from "next";

const nextConfig: NextConfig = {
turbopack: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dsruz1g5f/**",
      },
    ]
  }
};

export default nextConfig;

