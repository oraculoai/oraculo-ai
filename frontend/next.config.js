const rewrites = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return {
    fallback: [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
      {
        source: '/:path*',
        destination: `${apiUrl}/landing-page/:path*`,
      },
    ],
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites,
};

module.exports = nextConfig;
