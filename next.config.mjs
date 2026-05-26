/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CONTROLLER_URL: process.env.CONTROLLER_URL ?? "http://localhost:3001",
  },
};

export default nextConfig;
