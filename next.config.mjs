import "dotenv/config";

export default function nextConfig() {
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
