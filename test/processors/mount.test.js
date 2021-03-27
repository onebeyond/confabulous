const assert = require('chai').assert;
const mount = require('../../lib/processors/mount');

describe('mount', () => {
  it('should mount config at the specified key', () => {
    mount({ key : 'foo.bar' })({ baz: 1 }, (err, config) => {
      assert.ifError(err);
      assert.equal(config.foo.bar.baz, 1);
    });
  });

  it('should validate key', () => {
    mount({})({ baz: 1 }, (err) => {
      assert.ok(err);
      assert.equal(err.message, 'key is required');
    });
  });
});
