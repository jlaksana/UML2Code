/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./.jest/setEnvVars.js'],
  modulePathIgnorePatterns: ['./dist/'],
};
