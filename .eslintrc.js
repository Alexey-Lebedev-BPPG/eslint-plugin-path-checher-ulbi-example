module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
    'plugin:import/warnings',
  ],
  env: { browser: true, es2021: true, jest: true, node: true },
  overrides: [
    {
      files: ["tests/**/*.ts"],
      env: { mocha: true },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'import',
    'sort-keys-fix',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    "node/no-missing-import": "off",
  }
};
