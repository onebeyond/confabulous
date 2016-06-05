var debug = require('debug')('confabulous:transformers:unflatten')
var unflatten = require('flat').unflatten

module.exports = function() {

    return function(config, cb) {
        debug('running')
        cb(null, unflatten(config))
    }
}