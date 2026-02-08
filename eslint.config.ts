import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import config from '@krivega/eslint-config/jest';
import { defineConfig } from 'eslint/config';

const projectRoot = path.resolve(process.cwd());
const gitignorePath = path.resolve(projectRoot, '.gitignore');

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    extends: [config],
    rules: {
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      '@typescript-eslint/parameter-properties': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/filename-case': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: projectRoot,
      },
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/build/**',
      '**/.git/**',
      '**/public/**',
      '!.eslintrc.js',
      'package.json',
      'jsconfig.json',
      'manifest.json',
      '**/CHANGELOG.md',
      '**/.next/**',
      '**/.cache/**',
      '**/static/**',
      '**/*.min.js',
      '**/*.bundle.js',
      '**/generated/**',
      '**/__snapshots__/**',
      '**/tmp/**',
      '**/temp/**',
      '**/assets/**',
      '**/vendor/**',
    ],
  },
  {
    files: ['**/*.entity.ts', '**/*.dto.ts'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
]);
