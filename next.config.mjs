/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.1.9',
    '192.168.1.9:3000',
    'localhost:3000',
  ],
  async rewrites() {
    return [
      {
        source: '/suryasiddha',
        destination: '/suryasiddha/index.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/app/delete-account',
        destination: '/delete-account',
        permanent: true,
      },
      {
        source: '/account-deletion',
        destination: '/delete-account',
        permanent: true,
      },
      {
        source: '/delete',
        destination: '/delete-account',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
