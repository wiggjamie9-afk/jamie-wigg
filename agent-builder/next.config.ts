import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: {
    dirs: ["app", "components", "lib"],
  },
};

export default nextConfig;
