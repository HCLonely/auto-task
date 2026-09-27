import parser from '@typescript-eslint/parser';

export default [{
  files: ['**/*.ts'],
  languageOptions: { parser, ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-constant-condition': 'error', 'no-unreachable': 'error', 'no-duplicate-case': 'error',
    'no-console': 'error', 'no-var': 'error', 'prefer-const': 'error',
    quotes: ['error', 'single', { avoidEscape: true }], semi: ['error', 'always']
  }
}];
