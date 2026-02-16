module.exports = {
  reporters: [
    'default',
    ["jest-junit", {
      "outputDirectory": "test-reports/junit/",
      "outputName": "junit.xml"
    }]
  ],
  collectCoverage: true,
  coverageDirectory: "test-reports/coverage",
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  testRegex: '.*\\.test\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/node_modules/', '/examples/'],
  testEnvironment: 'jest-environment-jsdom-global',
};
