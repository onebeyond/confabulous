const { ifError, strictEqual: equal } = require('assert');
const args = require('../../lib/loaders/args');
const EventEmitter = require('events').EventEmitter;

describe('args', () => {
  const confabulous = new EventEmitter();

  beforeEach(() => {
    process.argv.push('--test-argument');
  });

  afterEach(() => {
    process.argv.pop();
  });

  it('should load arguments', (t, done) => {
    args()(confabulous, (err, config) => {
      ifError(err);
      equal(config['test-argument'], true);
      done();
    });
  });

  it('should post-process', (t, done) => {
    args([
      function (config, cb) {
        config['test-argument'] = !config['test-argument'];
        cb(null, config);
      },
    ])(confabulous, (err, config) => {
      ifError(err);
      equal(config['test-argument'], false);
      done();
    });
  });
});
