var assert = require('chai').assert
var exec = require('child_process').exec;
var Confabulous = require('..')

describe('Confabulous', function() {

    it('should load config', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.require({ path: './test/data/config.json', mandatory: true })
            }).end(function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                done()
            })
    })

    it('should freeze config', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.require({ path: './test/data/config.json', mandatory: true })
            }).end(function(err, config) {
                assert.ifError(err)
                config.frozen = true
                assert.equal(config.frozen, undefined)
                done()
            })
    })

    it('should emit loaded event', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(function(config) {
                return loaders.require({ path: './test/data/config.json', mandatory: true })
            }).on('loaded', function(config) {
                assert.equal(config.loaded, 'loaded')
                done()
            }).end()
    })

    it('should emit error event', function(done) {

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

    xit('should emit reload event', function(done) {

        const loaders = Confabulous.loaders

        const confabulous = new Confabulous()
            .add(function(config) {
                return loaders.file({ path: './test/data/config.json', mandatory: true, watch: true })
            }).end()

        confabulous.on('reloaded', function(config) {
            confabulous.removeAllListeners('reloaded')
            done()
        })

        exec('touch ./test/data/config.json', function(err) {
            assert.ifError(err)
        })
    })
})
