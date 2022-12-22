const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('jest', {
  modulePaths: ['src'],
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
  coveragePathIgnorePatterns: [
    'src/setupTest.js',
    'src/i18n',
    'src/.*\\.exp\\..*',
  ],
});
