var debug = require('debug')('confabulous:loaders:env')
var EventEmitter = require('events').EventEmitter
var async = require('async')
var minimist = require('minimist')

module.exports = function(postProcessors) {

    var emitter = new EventEmitter()

    return function(confabulous, cb) {
        debug('running')
        setImmediate(function() {
            var args = minimist(process.argv.slice(2))
            async.seq.apply(async, postProcessors)(args, cb)
        })
        return emitter
    }
}