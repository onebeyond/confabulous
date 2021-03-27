var debug = require('debug')('confabulous:transformers:mount')
var { set, has } = require('dot-prop');

module.exports = function(options) {

    return function(config, cb) {
        debug('running')
        validate(function(err) {
            if (err) return cb(err)
            cb(null, set({}, options.key, config))
        })
    }

    function validate(cb) {
        debug('validate: %s', JSON.stringify(options))
        if (!has(options, 'key')) return cb(new Error('key is required'))
        cb()
    }
}
