var debug = require('debug')('confabulous:transformers:flatten')
var flatten = require('flat')

module.exports = function() {

    return function(config, cb) {
        debug('running')
        cb(null, flatten(config))
    }
}