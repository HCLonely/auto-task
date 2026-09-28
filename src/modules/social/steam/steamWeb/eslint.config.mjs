import readabilityRules, { readabilityPlugin } from '../../../../../eslint.readability.mjs';
import tsParser from '@typescript-eslint/parser';

export default [{
  files: ['**/*.ts'],
  plugins: { readability: readabilityPlugin },
  languageOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    ...readabilityRules,
    'no-constant-condition': 'error',
    'no-unreachable': 'error',
    'no-duplicate-case': 'error',
    'no-console': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always']
  }
}];
