var assert = require('chai').assert
var json = require('../../lib/processors/json')

describe('json', function() {
    it('should parse config', function() {
        json()(JSON.stringify({ foo: { bar: { baz: 1 } } }), function(err, config) {
            assert.ifError(err)
            assert.equal(config.foo.bar.baz, 1)
        })
    })
})
