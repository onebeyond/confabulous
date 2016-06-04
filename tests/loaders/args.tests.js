var assert = require('chai').assert
var args = require('../../lib/loaders/args')

describe('args', function() {

    it('should add arguments', function(done) {
        args()({}, function(err, config) {
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
        ])({}, function(err, config) {
            assert.ifError(err)
            assert.equal(config.recursive, 'TESTS')
            done()
        })
    })
})