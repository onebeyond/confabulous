var assert = require('chai').assert
var flatten = require('../../lib/processors/flatten')

describe('flatten', function() {
    it('should flatten config', function() {
        flatten()({ foo: { bar: { baz: 1 } } }, function(err, config) {
            assert.ifError(err)
            assert.equal(config['foo.bar.baz'], 1)
        })
    })
})