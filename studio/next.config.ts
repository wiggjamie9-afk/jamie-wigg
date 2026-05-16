import type { NextConfig } from "next";

/**
 * Static export to Cloudflare Pages (per N1).
 * `next build` writes to `studio/out/`.
 *
 * - `output: "export"` produces a static HTML/JS bundle (no server runtime).
 * - `images.unoptimized` is required because next/image's default optimizer
 *   needs a server. We self-host every asset (N6) so the optimizer would be
 *   off anyway.
 * - `trailingSlash` keeps directory-style routes working on Cloudflare Pages.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
