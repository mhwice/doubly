import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* TODO: this is for testing with faker - remove for prod! */
  images: {
    domains: ['cdn.jsdelivr.net', 'avatars.githubusercontent.com'],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);

// export default nextConfig;
