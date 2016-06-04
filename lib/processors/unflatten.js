var debug = require('debug')('confusion:transformers:unflatten')
var unflatten = require('flat').unflatten

module.exports = function() {

    return function(config, listener, cb) {
        debug('running')
        cb(null, unflatten(config, listener))
    }

}