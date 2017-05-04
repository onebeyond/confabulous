var debug = require('debug')('confabulous:transformers:envToCamelCaseProp')
var unflatten = require('flat').unflatten
var merge = require('../merge')
var camelCase = require('camelize')

module.exports = function(_options) {

    var options = merge({ prefix: '', filter: /.*/ }, _options)

    return function(config, cb) {
        debug('running')

        var result = Object.keys(config).reduce(function(accumulator, key) {
            if (!options.filter.test(key)) return accumulator
            accumulator[toPropertyPath(stripPrefix(key, options.prefix))] = config[key]
            return accumulator
        }, {})
        cb(null, camelCase(unflatten(result), { deep: true }))

        function stripPrefix(key, prefix) {
            return key.replace(new RegExp('^' + prefix), '')
        }

        function toPropertyPath(key) {
            return key.toLowerCase().replace(/__/g, '.')
        }
    }
}
