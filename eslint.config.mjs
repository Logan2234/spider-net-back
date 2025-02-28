import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
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
                ecmaVersion: 'latest',
            },
        },
        rules: {
            'prettier/prettier': 'error', // Enforce Prettier rules
            'no-console': 'warn',
        },
    },
    prettier, // Disables conflicting ESLint rules in favor of Prettier
    { ignores: ['node_modules', 'dist'] }, // Ignore these directories
    {
        // update this to match your test files
        files: ['tests/**/*'],
        plugins: { jest: pluginJest },
        languageOptions: {
            globals: pluginJest.environments.globals.globals,
        },
    },
];
