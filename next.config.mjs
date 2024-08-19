/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  images: {
    // when true, every image will be unoptimized
    domains : ['assets.aceternity.com', 'localhost', 'picsum.photos'], // <== Domain name
    unoptimized: true,
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;