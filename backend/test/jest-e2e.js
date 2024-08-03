/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest-base.js');

module.exports = {
  ...baseConfig,
  testRegex: '^(?!.*disabled).*.spec-e2e.ts$',
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
};
