/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setupStore.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['app/js/store.js'],
}
