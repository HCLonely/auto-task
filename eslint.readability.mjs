// Shared by the application and standalone modules.
const requireParentheses = (context, node) => {
  const sourceCode = context.sourceCode;
  const before = sourceCode.getTokenBefore(node);
  const after = sourceCode.getTokenAfter(node);
  if (before?.value === '(' && after?.value === ')') {
    return;
  }
  context.report({
    node,
    messageId: 'wrap',
    fix(fixer) {
      return [
        fixer.insertTextBefore(node, '('),
        fixer.insertTextAfter(node, ')')
      ];
    }
  });
};

export const readabilityPlugin = {
  rules: {
    'nested-ternary-parens': {
      meta: {
        type: 'layout',
        docs: {
          description: 'Require parentheses around nested conditional expressions'
        },
        fixable: 'code',
        schema: [],
        messages: {
          wrap: 'Wrap this nested ternary expression in parentheses for readability.'
        }
      },
      create(context) {
        return {
          ConditionalExpression(node) {
            if (node.parent.type !== 'ConditionalExpression') {
              return;
            }
            requireParentheses(context, node);
          }
        };
      }
    },
    'ternary-or-parens': {
      meta: {
        type: 'layout',
        docs: {
          description: 'Require parentheses when mixing logical OR and conditional expressions'
        },
        fixable: 'code',
        schema: [],
        messages: {
          wrap: 'Wrap this expression in parentheses when mixing || and ternary expressions.'
        }
      },
      create(context) {
        return {
          LogicalExpression(node) {
            if (node.operator === '||' && node.parent.type === 'ConditionalExpression') {
              requireParentheses(context, node);
            }
          },
          ConditionalExpression(node) {
            if (node.parent.type === 'LogicalExpression' && node.parent.operator === '||') {
              requireParentheses(context, node);
            }
          }
        };
      }
    }
  }
};

export default {
  'readability/nested-ternary-parens': 'error',
  'readability/ternary-or-parens': 'error',
  indent: ['error', 2, { SwitchCase: 2 }],
  semi: ['error', 'always'],
  'no-trailing-spaces': 'error',
  curly: ['error', 'all'],
  'brace-style': ['error', '1tbs', { allowSingleLine: false }],
  'arrow-body-style': ['error', 'always'],
  'object-curly-newline': ['error', {
    ObjectExpression: {
      multiline: true,
      minProperties: 1,
      consistent: true
    },
    ObjectPattern: {
      multiline: true,
      minProperties: 2,
      consistent: true
    }
  }],
  'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
  'max-statements-per-line': ['error', { max: 1 }]
};
