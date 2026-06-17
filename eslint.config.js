import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '.next', 'out', '.swarm', 'ruvector.db'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
