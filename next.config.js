/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // Allow importing CSS from anywhere
  transpilePackages: [],
};

module.exports = nextConfig;
