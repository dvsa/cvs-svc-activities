module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFiles: ['jest-plugin-context/setup'],
  moduleFileExtensions: ['js', 'ts'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageDirectory: "./coverage",
  collectCoverage: true,
  testURL: "http://localhost",
  testMatch: ['**/*.*Test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/{!(ignore-me),}.ts']
};
