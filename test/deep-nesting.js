'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');

const depth = 4500;
const nest = (open, value, close) => open.repeat(depth) + value + close.repeat(depth);

describe('deeply nested patterns', () => {
  it('should support the default and expand entry points near the input limit', () => {
    const count = 4998;
    const pattern = '{'.repeat(count) + 'a,b' + '}'.repeat(count);
    assert.deepEqual(braces(pattern), [
      '{'.repeat(count - 1) + '(a|b)' + '}'.repeat(count - 1)
    ]);
    assert.deepEqual(braces(pattern, { expand: true }), [
      '{'.repeat(count - 1) + 'a' + '}'.repeat(count - 1),
      '{'.repeat(count - 1) + 'b' + '}'.repeat(count - 1)
    ]);
  });

  for (const ast of [false, true]) {
    const input = pattern => ast ? braces.parse(pattern) : pattern;
    describe(ast ? 'AST input' : 'string input', () => {
      it('should compile nested braces below the input length limit', () => {
        assert.equal(braces.compile(input(nest('{', 'a,b', '}'))),
          '{'.repeat(depth - 1) + '(a|b)' + '}'.repeat(depth - 1));
      });

      it('should expand nested braces below the input length limit', () => {
        assert.deepEqual(braces.expand(input(nest('{', 'a,b', '}'))), [
          nest('{', 'a', '}').slice(1, -1),
          nest('{', 'b', '}').slice(1, -1)
        ]);
      });

      it('should stringify nested braces below the input length limit', () => {
        const pattern = nest('{', 'a,b', '}');
        assert.equal(braces.stringify(input(pattern)), pattern);
      });

      for (const method of ['compile', 'expand', 'stringify']) {
        it(`should ${method} nested parentheses`, () => {
          const pattern = nest('(', 'x', ')');
          const expected = method === 'expand' ? [pattern] : pattern;
          assert.deepEqual(braces[method](input(pattern)), expected);
        });
      }
    });
  }
});
