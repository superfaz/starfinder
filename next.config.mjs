export default function nextConfig(phase, { defaultConfig }) {
  console.log(phase);
  console.log(defaultConfig);
  console.log(process.env);

  return {
    output: "standalone",
  };
}
