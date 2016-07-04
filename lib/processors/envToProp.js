var debug = require('debug')('confabulous:transformers:envToProp')
var unflatten = require('flat').unflatten

module.exports = function() {

    return function(config, cb) {
        debug('running')
        var result = Object.keys(config).reduce((accumulator, key) => {
            accumulator[key.toLowerCase().replace(/_/g, '.')] = config[key]
            return accumulator
        }, {})
        cb(null, unflatten(result))
    }
}