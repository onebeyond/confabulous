var assert = require('chai').assert
var env = require('../../lib/loaders/env')
var EventEmitter = require('events').EventEmitter

describe('env', function() {

    var confusion = new EventEmitter()

    it('should load environment variables', function(done) {
        env()(confusion, function(err, config) {
            assert.ifError(err)
            assert.equal(config.NODE_ENV, 'test')
            done()
        })
    })

    it('should post-process', function(done) {
        env([
            function(config, cb) {
                config.NODE_ENV = config.NODE_ENV.toUpperCase()
                cb(null, config)
            }
        ])(confusion, function(err, config) {
            assert.ifError(err)
            assert.equal(config.NODE_ENV, 'TEST')
            done()
        })
    })
})