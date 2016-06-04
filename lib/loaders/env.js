var debug = require('debug')('confusion:loaders:env')
var EventEmitter = require('events').EventEmitter
var async = require('async')

module.exports = function(postProcessors) {

    var emitter = new EventEmitter()

    return function(config, cb) {
        debug('running')
        setImmediate(function() {
            async.seq.apply(async, postProcessors)(process.env, cb)
        })
        return emitter
    }

}