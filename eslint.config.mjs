import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: [
			'**/.DS_Store',
			'**/node_modules',
			'build',
			'.svelte-kit',
			'package',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'**/.dockerignore',
			'**/pnpm-lock.yaml',
			'**/package-lock.json',
			'**/yarn.lock'
		]
	},
	...compat.extends('eslint:recommended', 'plugin:svelte/recommended', 'prettier'),
	{
		plugins: {
			svelte,
			'@typescript-eslint': typescriptEslint
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},

			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: '@typescript-eslint/parser'
			}
		},

		rules: {
			'no-console': 'warn',
			'no-unused-vars': 'off',

			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			]
		}
	}
];
