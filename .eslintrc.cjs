module.exports = {
	root: true,
	plugins: [
		'@typescript-eslint',
		'import',
	],
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'indent': ['error', 'tab'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'no-empty': ['error', { 'allowEmptyCatch': true }],
		'no-unused-vars': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'import/no-duplicates': ['warn'],
		'import/order': ['error', {
			'pathGroups': [
				{
					'pattern': '$*/**',
					'group': 'internal',
					'position': 'after',
				},
			],
			'groups': [
				'builtin',
				'external',
				'internal',
				'parent',
				'sibling',
				'index',
				'unknown',
			],
			'newlines-between': 'never',
			'alphabetize': {
				'order': 'asc',
				'caseInsensitive': true,
			},
		}],
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
			rules: {
				'@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^\\$\\$' }],
			},
		},
		// {
		// 	files: ['**/*.ts'],
		// 	plugins: [
		// 		'@typescript-eslint',
		// 	],
		// 	extends: [
		// 		'plugin:@typescript-eslint/eslint-recommended',
		// 		'plugin:@typescript-eslint/recommended',
		// 	],
		// 	env: {
		// 		browser: true,
		// 		es6: true,
		// 		node: true,
		// 	},
		// 	parserOptions: {
		// 		ecmaFeatures: {
		// 			'jsx': true,
		// 		},
		// 		ecmaVersion: 2018,
		// 		sourceType: 'module',
		// 		tsconfigRootDir: __dirname,
		// 		// project: './tsconfig.json',
		// 	},
		// 	globals: {
		// 		Atomics: 'readonly',
		// 		SharedArrayBuffer: 'readonly',
		// 	},
		// 	parser: '@typescript-eslint/parser',
		// 	rules: {
		// 		'@typescript-eslint/no-explicit-any': 0,
		// 	},
		// },
	],
};
