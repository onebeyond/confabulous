const assert = require('chai').assert;
const args = require('../../lib/loaders/args');
const EventEmitter = require('events').EventEmitter;

describe('args', () => {

  const confabulous = new EventEmitter();

  it('should load arguments', (t, done) => {
    args()(confabulous, (err, config) => {
      assert.ifError(err);
      assert.equal(config['test-argument'], true);
      done();
    });
  });

  it('should post-process', (t, done) => {
    args([
      function(config, cb) {
        config['test-argument'] = !config['test-argument'];
        cb(null, config);
      }
    ])(confabulous, (err, config) => {
      assert.ifError(err);
      assert.equal(config['test-argument'], false);
      done();
    });
  });
});
