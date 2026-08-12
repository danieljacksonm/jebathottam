/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "media.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "i.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "ichef.bbci.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.thehindu.com", pathname: "/**" },
      { protocol: "https", hostname: "th-i.thgim.com", pathname: "/**" },
      { protocol: "https", hostname: "www.aljazeera.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
