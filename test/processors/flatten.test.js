const assert = require('chai').assert;
const flatten = require('../../lib/processors/flatten');

describe('flatten', () => {
  it('should flatten config', () => {
    flatten()({ foo: { bar: { baz: 1 } } }, (err, config) => {
      assert.ifError(err);
      assert.equal(config['foo.bar.baz'], 1);
    });
  });
});
