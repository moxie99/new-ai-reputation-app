import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'pbs.twimg.com',
      'media-exp1.licdn.com',
      'avatars.githubusercontent.com',
    ],
  },
  // experimental: {
  //   serverActions: true,
  // },
}

export default nextConfig;
