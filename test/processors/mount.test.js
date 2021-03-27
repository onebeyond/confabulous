var assert = require('chai').assert
var mount = require('../../lib/processors/mount')

describe('mount', function() {
    it('should mount config at the specified key', function() {
        mount({ key : 'foo.bar' })({ baz: 1 }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.foo.bar.baz, 1)
        })
    })

    it('should validate key', function() {
        mount({})({ baz: 1 }, function(err, config) {
            assert.ok(err)
            assert.equal(err.message, 'key is required')
        })
    })
})
