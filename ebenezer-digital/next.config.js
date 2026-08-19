/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude yegova-saas (NestJS app) from Next.js compilation
  webpack(config) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [...(config.watchOptions?.ignored || []), "**/yegova-saas/**"],
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "media.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "i.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "ichef.bbci.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.thehindu.com", pathname: "/**" },
      { protocol: "https", hostname: "th-i.thgim.com", pathname: "/**" },
      { protocol: "https", hostname: "www.aljazeera.com", pathname: "/**" },
      { protocol: "https", hostname: "static01.nyt.com", pathname: "/**" },
      { protocol: "https", hostname: "media.npr.org", pathname: "/**" },
      { protocol: "https", hostname: "c.ndtvimg.com", pathname: "/**" },
      { protocol: "https", hostname: "images.indianexpress.com", pathname: "/**" },
      { protocol: "https", hostname: "www.hindustantimes.com", pathname: "/**" },
      { protocol: "https", hostname: "images.hindustantimes.com", pathname: "/**" },
      { protocol: "https", hostname: "static.reuters.com", pathname: "/**" },
      { protocol: "https", hostname: "cloudfront-us-east-2.images.arcpublishing.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
