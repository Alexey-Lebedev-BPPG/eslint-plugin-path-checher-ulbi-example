import eslint from '@eslint/js';
import n from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  n.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    ignores: ['dist/**/*'],
  },
  {
    languageOptions: {ecmaVersion: 'latest', sourceType: 'module'},
    plugins: {'sort-keys-fix': sortKeysFix, 'unused-imports': unusedImports},
    rules: {
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unpublished-import': 'off',
      // Отключаем правила для Node.js, которые конфликтуют с TypeScript
      'n/no-unsupported-features/es-syntax': 'off',
      'sort-keys-fix/sort-keys-fix': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {configs: {re}},
  {files: ['tests/**/*.js'], rules: {'n/no-unpublished-import': 'off'}},
];
