module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["./tests/setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  testTimeout: 120000, // Increased from 30000 to 120000
};
