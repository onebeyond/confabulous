var assert = require('chai').assert
var env = require('../../lib/loaders/env')
var EventEmitter = require('events').EventEmitter


describe('env', function() {

    process.env.LOADED_MOCHA_OPTS = 'true'
    var confabulous = new EventEmitter()

    it('should load environment variables', function(done) {
        env()(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.LOADED_MOCHA_OPTS, 'true')
            done()
        })
    })

    it('should post-process', function(done) {
        env([
            function(config, cb) {
                config.LOADED_MOCHA_OPTS = config.LOADED_MOCHA_OPTS.toUpperCase()
                cb(null, config)
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.LOADED_MOCHA_OPTS, 'TRUE')
            done()
        })
    })
})
