const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
  rules: {
    'import/no-unresolved': 'off',
  },
  'settings': {
    'import/resolver': {
      'node': {
        'paths': ['src'],
      },
    },
  },
  overrides: [{
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)", "setupTest.js"],
    rules: {
      'import/named': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  }],
});
