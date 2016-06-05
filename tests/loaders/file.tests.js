var assert = require('chai').assert
var file = require('../../lib/loaders/file')
var fs = require('fs')
var path = require('path')
var EventEmitter = require('events').EventEmitter

describe('file', function() {

    var confabulous

    beforeEach(function() {
        confabulous = new EventEmitter()
    })

    afterEach(function(done) {
        confabulous.emit('reloading')
        confabulous.removeAllListeners()
        try {
            server.close()
            done()
        } catch (err) {
            done()
        }
    })

    it('should require path when mandatory', function(done) {
        file()(confabulous, function(err, config) {
            assert(err)
            assert.equal(err.message, 'path is required')
            done()
        })
    })

    it('should load configuration', function(done) {
        file({ path: 'tests/data/config.json' })(confabulous, function(err, text) {
            assert.ifError(err)
            var config = JSON.parse(text)
            assert.equal(config.loaded, 'loaded')
            done()
        })
    })

    it('should report missing files when mandatory', function(done) {
        file({ path: 'does-not-exist.json' })(confabulous, function(err, config) {
            assert(err)
            assert(/ENOENT: no such file or directory/.test(err.message), err.message)
            done()
        })
    })

    it('should ignore 404s when not mandatory', function(done) {
        file({ path: 'does-not-exist.json', mandatory: false })(confabulous, function(err, config) {
            assert.equal(err, true)
            done()
        })
    })

    it('should emit change event when content changes', function(done) {
        file({ path: 'tests/data/config.json', watch: true })(confabulous, function(err, text) {
            assert.ifError(err)
            var config = JSON.parse(text)
            assert.equal(config.loaded, 'loaded')

            config.updated = new Date().toISOString()
            fs.writeFile('tests/data/config.json', JSON.stringify(config))
        }).on('change', done)
    })

    it('should emit change event when file is deleted', function(done) {
        fs.writeFileSync('tests/data/delete-me.txt', 'delete-me')
        file({ path: 'tests/data/delete-me.txt', mandatory: false, watch: true })(confabulous, function(err, text) {
            assert.ifError(err)
            fs.unlinkSync('tests/data/delete-me.txt')
        }).on('change', done)
    })

    it('should post-process', function(done) {

        file({ path: 'tests/data/config.json' }, [
            function(text, cb) {
                cb(null, JSON.parse(text))
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.loaded, 'loaded')
            done()
        })
    })
})