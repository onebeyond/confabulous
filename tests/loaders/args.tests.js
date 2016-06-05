var assert = require('chai').assert
var args = require('../../lib/loaders/args')
var EventEmitter = require('events').EventEmitter

describe('args', function() {

    var confabulous = new EventEmitter()

    it('should load arguments', function(done) {
        args()(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.recursive, 'tests')
            done()
        })
    })

    it('should post-process', function(done) {
        args([
            function(config, cb) {
                config.recursive = config.recursive.toUpperCase()
                cb(null, config)
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config.recursive, 'TESTS')
            done()
        })
    })
})