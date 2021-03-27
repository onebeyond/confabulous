const { ifError, strictEqual: equal } = require('assert');
const env = require('../../lib/loaders/env');
const EventEmitter = require('events').EventEmitter;


describe('env', () => {

  process.env.LOADED_MOCHA_OPTS = 'true';
  const confabulous = new EventEmitter();

  it('should load environment variables', (t, done) => {
    env()(confabulous, (err, config) => {
      ifError(err);
      equal(config.LOADED_MOCHA_OPTS, 'true');
      done();
    });
  });

  it('should post-process', (t, done) => {
    env([
      function(config, cb) {
        config.LOADED_MOCHA_OPTS = config.LOADED_MOCHA_OPTS.toUpperCase();
        cb(null, config);
      }
    ])(confabulous, (err, config) => {
      ifError(err);
      equal(config.LOADED_MOCHA_OPTS, 'TRUE');
      done();
    });
  });
});
