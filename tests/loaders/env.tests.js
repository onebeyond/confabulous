var assert = require('chai').assert
var env = require('../../lib/loaders/env')

describe('env', function() {

    it('should add environment variables', function(done) {
        env()({}, function(err, config) {
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
        ])({}, function(err, config) {
            assert.ifError(err)
            assert.equal(config.NODE_ENV, 'TEST')
            done()
        })
    })
})