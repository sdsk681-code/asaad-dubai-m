import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['*.replit.dev', '*.sisko.replit.dev'],
  }),
};

export default nextConfig;
