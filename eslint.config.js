import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores(['dist/**', 'dist-ssr/**']),
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx}'],
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^node:'],
                        ['^react(?:$|/)', '^@?\\w'],
                        ['^@/'],
                        ['^\\.'],
                        ['^\\u0000'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['./**', '../**'],
                            message: 'Используйте алиас @/ вместо относительных импортов.',
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['vite.config.ts'],
        languageOptions: { globals: globals.node },
    },
    prettier,
])
