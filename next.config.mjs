export default function nextConfig() {
  if (process.env.GITHUB_WORKFLOW) {
    // Configuration for Azure Static Web Apps
    console.log("Azure Static Web Apps configuration");
    return {
      output: "standalone",
    };
  } else if (process.env.NEXTJS_STANDALONE) {
    return {
      output: "standalone",
    };
  } else {
    // Default configuration
    return {};
  }
}
