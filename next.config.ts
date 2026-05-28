import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-5ca8e418-3824-432e-b21b-ef8b6b146395.space-z.ai",
    "preview-87c2c2ca.space.chatglm.site",
  ],
};

export default nextConfig;
