const { ifError, strictEqual: equal } = require('assert');
const json = require('../../lib/processors/json');

describe('json', () => {
  it('should parse config', () => {
    json()(JSON.stringify({ foo: { bar: { baz: 1 } } }), (err, config) => {
      ifError(err);
      equal(config.foo.bar.baz, 1);
    });
  });
});
