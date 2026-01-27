export default {
  // collectCoverageFrom: ['lib/rules/**/*.ts'],
  collectCoverageFrom: ['lib/rules/**/*.js'],
  // extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // preset: 'ts-jest',
  testEnvironment: 'node',
  // testMatch: ['**/tests/**/*.test.ts'],
  testMatch: ['**/tests/**/*.test.js'],
  // transform: {
  //   '^.+\\.ts$': [
  //     'ts-jest',
  //     {
  //       useESM: true,
  //     },
  //   ],
  // },
};
