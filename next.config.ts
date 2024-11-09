import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    localPatterns: [
      {
        pathname: '/images/*',
        search: '',
      },
    ],
  }, 
};

export default nextConfig;
