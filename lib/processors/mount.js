var debug = require('debug')('confusion:transformers:mount')
var merge = require('lodash.merge')
var set = require('lodash.set')

module.exports = function(_options) {

    var options = merge({}, _options)

    return function(config, cb) {
        debug('running')
        validate(function(err) {
            if (err) return cb(err)
            cb(null, set({}, options.key, config))
        })
    }

    function validate(cb) {
        debug('validate: %s', JSON.stringify(options))
        if (!options.key) return cb(null, new Error('key is required'))
        cb()
    }
}