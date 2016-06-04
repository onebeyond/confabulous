var fs = require('fs')
var path = require('path')
var async = require('async')
var has = require('lodash.has')
var defaults = require('lodash.defaults')
var noop = require('lodash.noop')
var debug = require('debug')('confusion:loaders:file')

module.exports = function(_options) {

    var options = defaults(_options || {}, { mandatory: true, encoding: 'utf8' })
    var watcher = { close: noop }

    return function(config, listener, cb) {
        debug('running')
        async.waterfall([validate, resolve, exists, unwatch, watch, load], cb)

        function validate(cb) {
            debug('validate: %s', JSON.stringify(options))
            if (!options) return cb(null, new Error('options are required'))
            if (!options.path) return cb(null, new Error('path is required'))
            cb()
        }

        function resolve(cb) {
            debug('resolve: %s', options.path)
            cb(null, path.resolve(options.path))
        }

        function exists(target, cb) {
            debug('exists: %s', target)
            fs.stat(target, function(err) {
                if (err && err.code == 'ENOENT' && !options.mandatory) return cb(true)
                cb(err, target)
            })
        }

        function unwatch(target, cb) {
            debug('unwatch: %s', target)
            watcher.close()
            return cb(null, target)
        }

        function watch(target, cb) {
            debug('watch: %s', target)
            if (options.watch) watcher = fs.watch(target, { persistent: false }, listener)
            return cb(null, target)
        }

        function load(target, cb) {
            debug('load: %s', target)
            fs.readFile(target, options.encoding, cb)
        }
    }

}