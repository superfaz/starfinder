export default function nextConfig() {
  if (process.env.GITHUB_WORKFLOW) {
    // Configuration for Azure Static Web Apps
    return {
      output: "standalone",
    };
  } else {
    // Default configuration
    return {};
  }
}
