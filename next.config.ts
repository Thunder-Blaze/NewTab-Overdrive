import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            exportType: 'named', // 👈 this enables `ReactComponent` named export
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
