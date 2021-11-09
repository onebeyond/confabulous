const { ifError, strictEqual: equal } = require('assert');
const unflatten = require('../../lib/processors/unflatten');

describe('unflatten', () => {
  it('should unflatten config', () => {
    unflatten()({ 'foo.bar.baz': 1 }, (err, config) => {
      ifError(err);
      equal(config.foo.bar.baz, 1);
    });
  });
});
