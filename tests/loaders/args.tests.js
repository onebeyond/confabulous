var assert = require('chai').assert
var args = require('../../lib/loaders/args')
var EventEmitter = require('events').EventEmitter

describe('args', function() {

    var confusion = new EventEmitter()

    it('should load arguments', function(done) {
        args()(confusion, function(err, config) {
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
        ])(confusion, function(err, config) {
            assert.ifError(err)
            assert.equal(config.recursive, 'TESTS')
            done()
        })
    })
})