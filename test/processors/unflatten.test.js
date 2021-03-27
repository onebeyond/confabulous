const assert = require('chai').assert;
const unflatten = require('../../lib/processors/unflatten');

describe('unflatten', () => {
  it('should unflatten config', () => {
    unflatten()({ 'foo.bar.baz' : 1 }, (err, config) => {
      assert.ifError(err);
      assert.equal(config.foo.bar.baz, 1);
    });
  });
});