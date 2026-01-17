import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  // serverExternalPackages replaces experimental.serverComponentsExternalPackages
  serverExternalPackages: ["webpack"],
  // removed unsupported experimental.forceWebPack (invalid next.config option)
};

export default nextConfig;
