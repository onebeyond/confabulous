var assert = require('chai').assert
var exec = require('child_process').exec;
var Confabulous = require('..')

describe('Confabulous', function() {

    it('should load config', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(config => loaders.require({ path: './test/data/config.json', mandatory: true }))
            .end((err, config) => {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                done()
            })
    })

    it('should freeze config', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(config => loaders.require({ path: './test/data/config.json', mandatory: true }))
            .end((err, config) => {
                assert.ifError(err)
                config.frozen = true
                assert.equal(config.frozen, undefined)
                done()
            })
    })

    it('should emit loaded event', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(config => loaders.require({ path: './test/data/config.json', mandatory: true }))
            .on('loaded', config => {
                assert.equal(config.loaded, 'loaded')
                done()
            }).end()
    })

    it('should emit error event', function(done) {

        const loaders = Confabulous.loaders

        new Confabulous()
            .add(config => loaders.require({ path: './test/data/missing.json', mandatory: true }))
            .on('error', err => {
                assert.ok(err)
                assert.ok(/ENOENT: no such file or directory/.test(err.message))
                done()
            }).end()
    })

    it('should emit reload event', function(done) {

        const loaders = Confabulous.loaders

        const confabulous = new Confabulous()
            .add(config => loaders.file({ path: './test/data/config.json', mandatory: true, watch: true }))
            .end()

        confabulous.on('reloaded', config => {
            confabulous.removeAllListeners('reloaded')
            done()
        })

        exec('touch ./test/data/config.json', function(err) {
            assert.ifError(err)
        })
    })
})
