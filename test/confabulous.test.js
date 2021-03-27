const assert = require('chai').assert;
const Confabulous = require('..');

describe('Confabulous', () => {

  it('should load config', (t, done) => {

    const loaders = Confabulous.loaders;

    new Confabulous()
      .add(() => {
        return loaders.echo({ loaded: 'loaded' });
      }).end((err, config) => {
        assert.ifError(err);
        assert.equal(config.loaded, 'loaded');
        done();
      });
  });

  it('should recursively merge config', (t, done) => {

    const loaders = Confabulous.loaders;

    new Confabulous()
      .add(() => {
        return loaders.echo({ loaded: 'loaded', nested: { items: [1] } });
      })
      .add(() => {
        return loaders.echo({ loaded: 'overridden', nested: { items: [2] } });
      }).end((err, config) => {
        assert.ifError(err);
        assert.equal(config.loaded, 'overridden');
        assert.equal(config.nested.items.length, 1);
        assert.equal(config.nested.items[0], 2);
        done();
      });
  });

  it('should support custom merge functions', (t, done) => {

    const loaders = Confabulous.loaders;
    const merge = function() { return 'merged'; };

    new Confabulous({ merge })
      .add(() => {
        return loaders.echo({ loaded: 'loaded' });
      })
      .add(() => {
        return loaders.echo({ loaded: 'overriden' });
      }).end((err, config) => {
        assert.ifError(err);
        assert.equal(config, 'merged');
        done();
      });
  });


  it('should freeze config', (t, done) => {

    const loaders = Confabulous.loaders;

    new Confabulous()
      .add(() => {
        return loaders.echo({ loaded: 'loaded' });
      }).end((err, config) => {
        assert.ifError(err);
        config.frozen = true;
        assert.equal(config.frozen, undefined);
        done();
      });
  });

  it('should emit loaded event', (t, done) => {

    const loaders = Confabulous.loaders;

    new Confabulous()
      .add(() => {
        return loaders.echo({ loaded: 'loaded' });
      }).on('loaded', (config) => {
        assert.equal(config.loaded, 'loaded');
        done();
      }).end();
  });

  it('should emit error event', (t, done) => {

    const loaders = Confabulous.loaders;

    new Confabulous()
      .add(() => {
        return loaders.require({ path: './test/data/missing.json', mandatory: true });
      }).on('error', (err) => {
        assert.ok(err);
        assert.ok(/ENOENT/.test(err.message), err.message);
        done();
      }).end();
  });
});
