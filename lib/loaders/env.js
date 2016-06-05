var debug = require('debug')('confabulous:loaders:env')
var EventEmitter = require('events').EventEmitter
var async = require('async')

module.exports = function(postProcessors) {

    var emitter = new EventEmitter()

    return function(confabulous, cb) {
        debug('running')
        setImmediate(function() {
            async.seq.apply(async, postProcessors)(process.env, cb)
        })
        return emitter
    }

}