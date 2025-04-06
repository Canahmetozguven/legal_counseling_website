module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  plugins: [
    "react",
    "react-hooks",
    "jest"
  ],
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
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"]
    },
    ecmaFeatures: {
      jsx: true,
      classes: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};