import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // keep your current experimental/reactCompiler if you want
  outputFileTracingRoot: path.resolve(process.cwd()),
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;