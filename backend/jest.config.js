module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["./tests/setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  testTimeout: 30000, // Increase timeout for all tests to 30 seconds
};
