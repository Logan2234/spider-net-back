import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended, // Base ESLint rules
  ...tseslint.configs.recommended, // TypeScript-specific rules
  {
    files: ['**/*.ts', '**/*.tsx'], // Apply to TypeScript files
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // Ensure ESLint understands your TS config
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    },
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'prettier/prettier': 'error', // Enforce Prettier rules
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ]
    }
  },
  prettier, // Disables conflicting ESLint rules in favor of Prettier
  {
    // update this to match your test files
    files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals
    },
    rules: {
      ...pluginJest.configs.recommended.rules // ✅ Recommended Jest rules
    }
  },
  { ignores: ['node_modules', 'dist'] } // Ignore these directories
];
