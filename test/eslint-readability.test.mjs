import assert from 'node:assert/strict';
import test from 'node:test';
import { Linter } from 'eslint';
import { readabilityPlugin } from '../eslint.readability.mjs';

const linter = new Linter();
const config = {
  plugins: { readability: readabilityPlugin },
  rules: {
    'readability/nested-ternary-parens': 'error',
    'readability/ternary-or-parens': 'error'
  }
};

const cases = [
  ["ok ? child.skipped ? 'skipped' : 'success' : 'failure'",
    "ok ? (child.skipped ? 'skipped' : 'success') : 'failure'"],
  ['a ? b : c ? d : e', 'a ? b : (c ? d : e)'],
  ['a ? b ? c : d : e ? f : g', 'a ? (b ? c : d) : (e ? f : g)'],
  ['a ? b ? c ? d : e : f : g', 'a ? (b ? (c ? d : e) : f) : g'],
  ['a ? /* keep */ b ? c : d : e', 'a ? /* keep */ (b ? c : d) : e'],
  ['a ? (/* keep */ b ? c : d) : e', 'a ? (/* keep */ b ? c : d) : e'],
  ['(a ? b : c) ? d : e', '(a ? b : c) ? d : e'],
  ['a ? b : c', 'a ? b : c'],
  ['fn(a ? b : c, d ? e : f)', 'fn(a ? b : c, d ? e : f)'],
  ['a || b ? c : d', '(a || b) ? c : d'],
  ['a ? b || c : d', 'a ? (b || c) : d'],
  ['a ? b : c || d', 'a ? b : (c || d)'],
  ['a || b || c ? d : e', '(a || b || c) ? d : e'],
  ['a || b ? c || d : e || f', '(a || b) ? (c || d) : (e || f)'],
  ['a ? b ? c : d || e : f', 'a ? (b ? c : (d || e)) : f'],
  ['a ? b : /* keep */ c || d', 'a ? b : /* keep */ (c || d)'],
  ['a ? b : (/* keep */ c || d)', 'a ? b : (/* keep */ c || d)'],
  ['a || (b ? c : d)', 'a || (b ? c : d)'],
  ['(a ? b : c) || d', '(a ? b : c) || d'],
  ['a || b', 'a || b'],
  ['fn(a || b, c ? d : e)', 'fn(a || b, c ? d : e)']
];

for (const [source, expected] of cases) {
  test(source, () => {
    const result = linter.verifyAndFix(source, config);
    assert.equal(result.output, expected);
    assert.deepEqual(result.messages, []);
    assert.equal(linter.verifyAndFix(result.output, config).fixed, false);
  });
}
