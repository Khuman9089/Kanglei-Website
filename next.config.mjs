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
};

export default nextConfig;
