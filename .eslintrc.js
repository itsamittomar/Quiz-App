module.exports = {
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'prettier', // Integrates Prettier with ESLint
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'semi': ['error', 'always'], // Enforces semicolons for all files
      '@typescript-eslint/semi': ['error', 'always'], // Enforces semicolons specifically for TypeScript
      'prettier/prettier': [
        'error',
        {
          semi: true, // Ensure Prettier adds semicolons
          singleQuote: true,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],
    },
  };
  