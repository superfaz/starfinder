module.exports = {
  env: { es6: true, node: true },
  plugins: ["@typescript-eslint", "sonarjs", "eslint-plugin-tsdoc"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  rules: {
    "@next/next/no-page-custom-font": "off",
    "tsdoc/syntax": "warn",
  },
};
