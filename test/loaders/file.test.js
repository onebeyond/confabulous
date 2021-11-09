const { ok, ifError, strictEqual: equal } = require('assert');
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
    fs.writeFileSync('test/data/config.json', JSON.stringify({ loaded: 'loaded' }, null, 2));
    /* eslint-disable-next-line no-empty */
    try {
      fs.unlinkSync(doomed);
    } catch (err) {}
  });

  it('should require path when mandatory', (t, done) => {
    file()(confabulous, (err) => {
      ok(err);
      equal(err.message, 'path is required');
      done();
    });
  });

  it('should load configuration', (t, done) => {
    file({ path: 'test/data/config.json' })(confabulous, (err, text) => {
      ifError(err);
      const config = JSON.parse(text);
      equal(config.loaded, 'loaded');
      done();
    });
  });

  it('should report missing files when mandatory', (t, done) => {
    file({ path: 'does-not-exist.json' })(confabulous, (err) => {
      ok(err);
      ok(/ENOENT/.test(err.message), err.message);
      done();
    });
  });

  it('should ignore missing files when not mandatory', (t, done) => {
    file({ path: 'does-not-exist.json', mandatory: false })(confabulous, (err) => {
      equal(err, true);
      done();
    });
  });

  it('should emit change event when content changes', (t, done) => {
    file({ path: 'test/data/config.json', watch: true })(confabulous, (err, text) => {
      ifError(err);
      const config = JSON.parse(text);
      equal(config.loaded, 'loaded');
      config.updated = new Date().toISOString();
      fs.writeFile('test/data/config.json', JSON.stringify(config, null, 2), (err) => {
        ifError(err);
      });
    }).once('change', done);
  });

  it('should emit change event when file is deleted', (t, done) => {
    fs.writeFileSync(doomed, JSON.stringify({ foo: 'bar' }));
    file({ path: doomed, mandatory: false, watch: true })(confabulous, (err) => {
      ifError(err);
      fs.unlink(doomed, (err) => {
        ifError(err);
      });
    }).once('change', done);
  });

  it('should stop watching on close event', (t, done) => {
    file({ path: 'test/data/config.json', watch: true })(confabulous, (err, text) => {
      ifError(err);
      confabulous.emit('closing');
      const config = JSON.parse(text);
      equal(config.loaded, 'loaded');
      config.updated = new Date().toISOString();
      fs.writeFile('test/data/config.json', JSON.stringify(config, null, 2), (err) => {
        ifError(err);
        setTimeout(done, 200);
      });
    }).once('change', () => {
      done(new Error('Should not have emitted change event'));
    });
  });

  it('should post-process', (t, done) => {
    file({ path: 'test/data/config.json' }, [
      function (text, cb) {
        cb(null, JSON.parse(text));
      },
    ])(confabulous, (err, config) => {
      ifError(err);
      equal(config.loaded, 'loaded');
      done();
    });
  });
});
