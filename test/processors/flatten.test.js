const { ifError, strictEqual: equal } = require('assert');
const flatten = require('../../lib/processors/flatten');

describe('flatten', () => {
  it('should flatten config', () => {
    flatten()({ foo: { bar: { baz: 1 } } }, (err, config) => {
      ifError(err);
      equal(config['foo.bar.baz'], 1);
    });
  });
});
