module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text", "text-summary"],
    collectCoverageFrom: ["backend.js"]
  };