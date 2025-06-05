module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // permite transpilar axios que é ESM
  ],
  moduleFileExtensions: ["js", "jsx"],
};
