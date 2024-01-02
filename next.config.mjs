import { withSentryConfig } from "@sentry/nextjs";

function nextConfig() {
  const standardConfig = {
    eslint: { dirs: ["app", "data", "logic", "model"] },
  };

  if (process.env.GITHUB_WORKFLOW) {
    // Configuration for Azure Static Web Apps
    console.log("Azure Static Web Apps configuration");
    return { ...standardConfig, output: "standalone" };
  } else if (process.env.NEXTJS_STANDALONE) {
    console.log("Local standalone configuration");
    return { ...standardConfig, output: "standalone" };
  } else {
    // Default configuration
    return standardConfig;
  }
}

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "superfaz",
    project: "starfinder",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
