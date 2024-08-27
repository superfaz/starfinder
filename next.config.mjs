import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const BASE_CONFIG = {
  eslint: { dirs: ["src", "mocks"] },
};

const CODESPACE_CONFIG = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

function nextConfig(phase) {
  const config = { ...DEFAULT_CONFIG };

  if (phase === PHASE_DEVELOPMENT_SERVER && !!process.env.CODESPACE_NAME) {
    Object.assign(config, CODESPACE_CONFIG);
  }

  return config;
}

// Analyze
const config = process.env.ANALYZE ? withBundleAnalyzer(nextConfig) : nextConfig;

const sentryConfig = withSentryConfig(config, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "superfaz",
  project: "starfinder",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});

export default sentryConfig;
