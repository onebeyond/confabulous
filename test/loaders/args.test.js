var assert = require('chai').assert
var args = require('../../lib/loaders/args')
var EventEmitter = require('events').EventEmitter

describe('args', function() {

    var confabulous = new EventEmitter()

    it('should load arguments', function(t, done) {
        args()(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config['test-argument'], true)
            done()
        })
    })

    it('should post-process', function(t, done) {
        args([
            function(config, cb) {
                config['test-argument'] = !config['test-argument']
                cb(null, config)
            }
        ])(confabulous, function(err, config) {
            assert.ifError(err)
            assert.equal(config['test-argument'], false)
            done()
        })
    })
})
