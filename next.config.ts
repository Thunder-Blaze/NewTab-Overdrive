import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'preview.redd.it',
            },
            {
                protocol: 'https',
                hostname: 'i.redd.it',
            },
        ],
    },
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
        })

        return config
    },
}

export default nextConfig
