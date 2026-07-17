import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev', '127.0.0.1'],
};

export default nextConfig;
