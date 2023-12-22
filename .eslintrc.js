module.exports = {
  env: { es6: true, node: true, jest: true },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:sonarjs/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  plugins: ["@typescript-eslint", "sonarjs"],
  rules: {
    "@next/next/no-page-custom-font": "off",
  },
};
