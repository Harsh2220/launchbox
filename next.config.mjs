/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        defaultVendors: false,
      };
    }
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' https://*.walletconnect.org https://*.walletconnect.com;`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
