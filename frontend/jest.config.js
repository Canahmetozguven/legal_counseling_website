module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,jsx}", "<rootDir>/src/**/*.{spec,test}.{js,jsx}"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+\\.js$"
  ],
  moduleNameMapper: {
    "^axios$": require.resolve("axios")
  },
  coveragePathIgnorePatterns: ["/node_modules/"],
  verbose: true
};