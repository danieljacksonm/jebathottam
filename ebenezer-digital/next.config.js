/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude yegova-saas (NestJS app) from Next.js compilation
  webpack(config) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/yegova-saas/**"],
    };
    return config;
  },
  async headers() {
    return [
      {
        // Do not attach security headers to static chunks — avoids MIME/nosniff issues with CSS/JS
        source:
          "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:css|js|map|woff2?|png|jpg|jpeg|gif|webp|svg|ico)).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7,
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
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "www.zohowebstatic.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
