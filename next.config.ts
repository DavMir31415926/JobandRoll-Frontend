import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Your other Next.js config options
  typescript: {
    // This will ignore type checking during production builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Optionally ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  }
};

export default withNextIntl(nextConfig);