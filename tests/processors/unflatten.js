var assert = require('chai').assert
var unflatten = require('../../lib/processors/unflatten')

describe('unflatten', function() {
    it('should unflatten config', function() {
        unflatten()({ 'foo.bar.baz' : 1 }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.foo.bar.baz, 1)
        })
    })
})