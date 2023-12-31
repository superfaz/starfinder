const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config = {
  coverageProvider: "v8",
  coverageReporters: ["lcov", "text"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
    "^.+\\.ts?$": "@swc/jest",
  },
  moduleNameMapper: {
    uuid: "<rootDir>/mocks/uuid.js",
    "^app/(.*)$": "<rootDir>/app/$1",
    "^data$": "<rootDir>/data",
    "^data/(.*)$": "<rootDir>/data/$1",
    "^logic$": "<rootDir>/logic",
    "^mocks/(.*)$": "<rootDir>/mocks/$1",
    "^model$": "<rootDir>/model",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
