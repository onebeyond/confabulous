const { ok, ifError, strictEqual: equal } = require('assert');
const mount = require('../../lib/processors/mount');

describe('mount', () => {
  it('should mount config at the specified key', () => {
    mount({ key: 'foo.bar' })({ baz: 1 }, (err, config) => {
      ifError(err);
      equal(config.foo.bar.baz, 1);
    });
  });

  it('should validate key', () => {
    mount({})({ baz: 1 }, (err) => {
      ok(err);
      equal(err.message, 'key is required');
    });
  });
});
