/* global module */

/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  preset: 'ts-jest',
  // eslint-disable-next-line no-undef
  setupFiles: [`${__dirname}/jest.setup.ts`],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};