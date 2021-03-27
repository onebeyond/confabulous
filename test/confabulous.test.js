var assert = require('chai').assert
var Confabulous = require('..')

describe('Confabulous', function() {

    it('should load config', function(t, done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.echo({ loaded: 'loaded' })
            }).end(function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                done()
            })
    })

    it('should recursively merge config', function(t, done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.echo({ loaded: 'loaded', nested: { items: [1] } })
            })
            .add(function(config) {
                return loaders.echo({ loaded: 'overridden', nested: { items: [2] } })
            }).end(function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'overridden')
                assert.equal(config.nested.items.length, 1)
                assert.equal(config.nested.items[0], 2)
                done()
            })
    })

    it('should support custom merge functions', function(t, done) {

        const loaders = Confabulous.loaders
        const merge = function() { return 'merged' }

        new Confabulous({ merge: merge })
            .add(function(config) {
                return loaders.echo({ loaded: 'loaded' })
            })
            .add(function(config) {
                return loaders.echo({ loaded: 'overriden' })
            }).end(function(err, config) {
                assert.ifError(err)
                assert.equal(config, 'merged')
                done()
            })
    })


    it('should freeze config', function(t, done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.echo({ loaded: 'loaded' })
            }).end(function(err, config) {
                assert.ifError(err)
                config.frozen = true
                assert.equal(config.frozen, undefined)
                done()
            })
    })

    it('should emit loaded event', function(t, done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.echo({ loaded: 'loaded' })
            }).on('loaded', function(config) {
                assert.equal(config.loaded, 'loaded')
                done()
            }).end()
    })

    it('should emit error event', function(t, done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.require({ path: './test/data/missing.json', mandatory: true })
            }).on('error', function(err) {
                assert.ok(err)
                assert.ok(/ENOENT/.test(err.message), err.message)
                done()
            }).end()
    })
})
