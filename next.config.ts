import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1mb; the premium-content admin form uploads plan/PDF
      // downloads and thumbnail images through a Server Action.
      bodySizeLimit: "20mb",
    },
  },
  async redirects() {
    return [
      { source: "/gallery", destination: "/about", permanent: true },
      { source: "/video", destination: "/videos", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
