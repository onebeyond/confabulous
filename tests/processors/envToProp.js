var assert = require('chai').assert
var envToProp = require('../../lib/processors/envToProp')

describe('Environment Variables to Properties', function() {
    it('should convert ENV_VAR to env.var', function() {
        envToProp()({ NODE_ENV: 'test' }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.node.env, 'test')
        })
    })
})