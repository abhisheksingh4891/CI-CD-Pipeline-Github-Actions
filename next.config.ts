/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true, // Disable automatic image optimization
  },
};

module.exports = nextConfig;
