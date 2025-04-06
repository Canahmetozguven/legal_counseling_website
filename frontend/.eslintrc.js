module.exports = {
  extends: ['react-app', 'react-app/jest'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    process: true,
    module: true,
  },
  rules: {
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'warn',
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};