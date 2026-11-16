import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Tambah ini kalau react-simple-maps error
  transpilePackages: ["react-simple-maps"],
}

export default nextConfig