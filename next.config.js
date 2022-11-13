/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['i.ibb.co'],
    },
};

module.exports = nextConfig;
