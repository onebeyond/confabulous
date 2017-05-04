var assert = require('chai').assert
var envToProp = require('../../lib/processors/envToCamelCaseProp')

describe('Environment Variables to Camel Case Properties', function() {

    it('should convert USER__FIRST_NAME to env.var', function() {
        envToProp()({ USER__FIRST_NAME: 'test' }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.user.firstName, 'test')
        })
    })

    it('should convert GS_USER__FIRST_NAME to env.var', function() {
        envToProp({ prefix: 'GS_' })({ GS_USER__FIRST_NAME: 'test' }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.user.firstName, 'test')
        })
    })

    it('should only strip matching of environment names', function() {
        envToProp({ prefix: 'GS_' })({ XGS_USER__FIRST_NAME: 'test' }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.xgsUser.firstName, 'test')
        })
    })

    it('should filter environment names', function() {
        envToProp({ prefix: 'GS_', filter: /^GS_/ })({ XGS_USER_FIRST_NAME: 'fail', GS_USER__FIRST_NAME: 'test' }, function(err, config) {
            assert.ifError(err)
            assert.equal(config.user.firstName, 'test')
            assert.equal(Object.keys(config).length, 1)
        })
    })
})
