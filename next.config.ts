/*import type { NextConfig } from "next";

const nextConfig: NextConfig = {*/
  /* config options here */
/*};

export default nextConfig;*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React Strict Mode
  typescript: {
    // Enable TypeScript error during build (optional but recommended)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

