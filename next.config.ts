import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/art/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/documents/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/work/:path*", destination: "/#work", permanent: true },
      { source: "/projects/:path*", destination: "/#work", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/portfolio", destination: "/#work", permanent: true },
      { source: "/services", destination: "/#about", permanent: true },
      { source: "/blog", destination: "/#journey", permanent: true },
      { source: "/testimonials", destination: "/#recognition", permanent: true },
      { source: "/tools/:path*", destination: "/#work", permanent: true },
    ];
  },
};
export default nextConfig;
