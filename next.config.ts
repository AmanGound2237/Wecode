import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16: set to `false` (boolean) to completely disable the dev indicator.
  // The old object form { buildActivity, appIsrStatus } is no longer recognized here.
  devIndicators: false,
  // Allow the specific IP to connect in dev mode
  allowedDevOrigins: ['http://100.95.73.89', '100.95.73.89'],
} as any;

export default nextConfig;
