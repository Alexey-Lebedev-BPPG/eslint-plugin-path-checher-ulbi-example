import {defineConfig, globalIgnores} from 'eslint/config';
import eslint from '@eslint/js';
import n from 'eslint-plugin-n';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import parser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Base JS recommended rules
  {
    name: 'eslint-plugin-path-checher-ulbi-example/js-recommended',
    files: ['**/*.js'],
    ...eslint.configs.recommended,
  },
  // Node.js rules
  {
    name: 'eslint-plugin-path-checher-ulbi-example/node-recommended',
    files: ['**/*.js'],
    ...n.configs['flat/recommended'],
  },
  // Import plugin rules
  {
    name: 'eslint-plugin-path-checher-ulbi-example/import-recommended',
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.mts'],
    ...importPlugin.flatConfigs.recommended,
    ...importPlugin.flatConfigs.typescript,
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
  // Global ignores
  globalIgnores(['dist/**/*'], {
    name: 'eslint-plugin-path-checher-ulbi-example/ignores',
  }),
  // TypeScript source files
  {
    name: 'eslint-plugin-path-checher-ulbi-example/typescript-src',
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  // TypeScript test files
  {
    name: 'eslint-plugin-path-checher-ulbi-example/typescript-tests',
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  // Global rules for all linted files
  {
    name: 'eslint-plugin-path-checher-ulbi-example/rules',
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
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
  // Test JS files
  {
    name: 'eslint-plugin-path-checher-ulbi-example/test-js',
    files: ['tests/**/*.js'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
]);
