import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev'],
};

export default nextConfig;
