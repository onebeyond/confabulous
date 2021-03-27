const assert = require('chai').assert;
const file = require('../../lib/loaders/file');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

describe('file', () => {

  let confabulous;
  const id = Math.floor(Math.random() * 10000000);
  const doomed = 'test/data/delete-me-' + id + '.json';

  beforeEach(() => {
    confabulous = new EventEmitter();
  });

  afterEach(() => {
    confabulous.emit('reloading');
    confabulous.removeAllListeners();
    fs.writeFileSync('test/data/config.json', JSON.stringify({ loaded: "loaded" }, null, 2));
    /* eslint-disable-next-line no-empty */
    try { fs.unlinkSync(doomed); } catch(err) {}
  });

  it('should require path when mandatory', (t, done) => {
    file()(confabulous, (err) => {
      assert(err);
      assert.equal(err.message, 'path is required');
      done();
    });
  });

  it('should load configuration', (t, done) => {
    file({ path: 'test/data/config.json' })(confabulous, (err, text) => {
      assert.ifError(err);
      const config = JSON.parse(text);
      assert.equal(config.loaded, 'loaded');
      done();
    });
  });

  it('should report missing files when mandatory', (t, done) => {
    file({ path: 'does-not-exist.json' })(confabulous, (err) => {
      assert(err);
      assert(/ENOENT/.test(err.message), err.message);
      done();
    });
  });

  it('should ignore missing files when not mandatory', (t, done) => {
    file({ path: 'does-not-exist.json', mandatory: false })(confabulous, (err) => {
      assert.equal(err, true);
      done();
    });
  });

  it('should emit change event when content changes', (t, done) => {
    file({ path: 'test/data/config.json', watch: true })(confabulous, (err, text) => {
      assert.ifError(err);
      const config = JSON.parse(text);
      assert.equal(config.loaded, 'loaded');
      config.updated = new Date().toISOString();
      fs.writeFile('test/data/config.json', JSON.stringify(config, null, 2), (err) => {
        assert.ifError(err);
      });
    }).once('change', done);
  });

  it('should emit change event when file is deleted', (t, done) => {
    fs.writeFileSync(doomed, JSON.stringify({ foo: "bar" }));
    file({ path: doomed, mandatory: false, watch: true })(confabulous, (err) => {
      assert.ifError(err);
      fs.unlink(doomed, (err) => {
        assert.ifError(err);
      });
    }).once('change', done);
  });

  it('should post-process', (t, done) => {

    file({ path: 'test/data/config.json' }, [
      function(text, cb) {
        cb(null, JSON.parse(text));
      }
    ])(confabulous, (err, config) => {
      assert.ifError(err);
      assert.equal(config.loaded, 'loaded');
      done();
    });
  });
});
