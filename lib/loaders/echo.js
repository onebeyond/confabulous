var debug = require('debug')('confabulous:loaders:echo')
var EventEmitter = require('events').EventEmitter
var async = require('async')

module.exports = function(data, postProcessors) {

    var emitter = new EventEmitter()

    return function(confabulous, cb) {
        debug('running')
        setImmediate(function() {
            async.seq.apply(async, postProcessors)(data, cb)
        })
        return emitter
    }
}
