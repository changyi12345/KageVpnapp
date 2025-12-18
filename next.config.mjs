import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
  // keep your current experimental/reactCompiler if you want
  outputFileTracingRoot: path.resolve(process.cwd()),
  // removed: eslint config (no longer supported in Next 16)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-transform' },
        ],
      },
    ];
  },
};

export default nextConfig;