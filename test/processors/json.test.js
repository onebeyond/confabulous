const assert = require('chai').assert;
const json = require('../../lib/processors/json');

describe('json', () => {
  it('should parse config', () => {
    json()(JSON.stringify({ foo: { bar: { baz: 1 } } }), (err, config) => {
      assert.ifError(err);
      assert.equal(config.foo.bar.baz, 1);
    });
  });
});
