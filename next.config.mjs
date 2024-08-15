/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images : {
        domains : ['assets.aceternity.com', 'localhost', 'picsum.photos'] // <== Domain name
    }
};

export default nextConfig;

