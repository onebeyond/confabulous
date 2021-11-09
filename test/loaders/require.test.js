const { ok, ifError, strictEqual: equal } = require('assert');
const req = require('../../lib/loaders/require');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

describe('require', () => {
  let confabulous;
  const id = Math.floor(Math.random() * 10000000);
  const doomed = 'test/data/delete-me-' + id + '.json';

  beforeEach(() => {
    confabulous = new EventEmitter();
  });

  afterEach(() => {
    confabulous.emit('reloading');
    confabulous.removeAllListeners();
    fs.writeFileSync('test/data/config.json', JSON.stringify({ loaded: 'loaded' }, null, 2));
    /* eslint-disable-next-line no-empty */
    try {
      fs.unlinkSync(doomed);
    } catch (err) {}
  });

  it('should require path when mandatory', (t, done) => {
    req()(confabulous, (err) => {
      ok(err);
      equal(err.message, 'path is required');
      done();
    });
  });

  it('should load configuration', (t, done) => {
    req({ path: 'test/data/config.json' })(confabulous, (err, config) => {
      ifError(err);
      equal(config.loaded, 'loaded');
      done();
    });
  });

  it('should report missing files when mandatory', (t, done) => {
    req({ path: 'does-not-exist.json' })(confabulous, (err) => {
      ok(err);
      ok(/ENOENT/.test(err.message), err.message);
      done();
    });
  });

  it('should ignore missing files when not mandatory', (t, done) => {
    req({ path: 'does-not-exist.json', mandatory: false })(confabulous, (err) => {
      equal(err, true);
      done();
    });
  });

  it('should emit change event when content changes', (t, done) => {
    req({ path: 'test/data/config.json', watch: true })(confabulous, (err, config) => {
      ifError(err);
      equal(config.loaded, 'loaded');
      config.updated = new Date().toISOString();
      fs.writeFile('test/data/config.json', JSON.stringify(config, null, 2), (err) => {
        ifError(err);
      });
    }).once('change', done);
  });

  it('should emit change event when file is deleted', (t, done) => {
    fs.writeFileSync(doomed, JSON.stringify({ foo: 'bar' }));
    req({ path: doomed, mandatory: false, watch: true })(confabulous, (err) => {
      ifError(err);
      fs.unlink(doomed, (err) => {
        ifError(err);
      });
    }).once('change', done);
  });

  it('should post-process', (t, done) => {
    req({ path: 'test/data/config.json' }, [
      function (config, cb) {
        config.loaded = config.loaded.toUpperCase();
        cb(null, config);
      },
    ])(confabulous, (err, config) => {
      ifError(err);
      equal(config.loaded, 'LOADED');
      done();
    });
  });
});
