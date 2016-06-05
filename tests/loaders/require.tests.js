var assert = require('chai').assert
var req = require('../../lib/loaders/require')
var fs = require('fs')
var EventEmitter = require('events').EventEmitter

describe('require', function() {

    var confabulous

    beforeEach(function() {
        confabulous = new EventEmitter()
    })

    afterEach(function() {
        confabulous.emit('reloading')
        confabulous.removeAllListeners()
        fs.writeFileSync('tests/data/config.json', JSON.stringify({ loaded: "loaded" }, null, 2))
        try { fs.unlinkSync('tests/data/delete-me.json') } catch(err) {}
    })

    it('should require path when mandatory', function(done) {
        req()(confabulous, function(err, config) {
            assert(err)
            assert.equal(err.message, 'path is required')
            done()
        })
    })

    it('should load configuration', function(done) {
        req({ path: 'tests/data/config.json' })(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.loaded, 'loaded')
            done()
        })
    })

    it('should report missing files when mandatory', function(done) {
        req({ path: 'does-not-exist.json' })(confabulous, function(err, config) {
            assert(err)
            assert(/ENOENT/.test(err.message), err.message)
            done()
        })
    })

    it('should ignore missing files when not mandatory', function(done) {
        req({ path: 'does-not-exist.json', mandatory: false })(confabulous, function(err, config) {
            assert.equal(err, true)
            done()
        })
    })

    it('should emit change event when content changes', function(done) {
        req({ path: 'tests/data/config.json', watch: true })(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.loaded, 'loaded')
            config.updated = new Date().toISOString()
            fs.writeFile('tests/data/config.json', JSON.stringify(config, null, 2))
        }).on('change', done)
    })

    it('should emit change event when file is deleted', function(done) {
        fs.writeFileSync('tests/data/delete-me.json', JSON.stringify({ foo: "bar" }))
        req({ path: 'tests/data/delete-me.json', mandatory: false, watch: true })(confabulous, function(err, config) {
            assert.ifError(err)
            fs.unlink('tests/data/delete-me.json')
        }).on('change', done)
    })

    it('should post-process', function(done) {

        req({ path: 'tests/data/config.json' }, [
            function(config, cb) {
                config.loaded = config.loaded.toUpperCase()
                cb(null, config)
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.loaded, 'LOADED')
            done()
        })
    })
})