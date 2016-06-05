var debug = require('debug')('confabulous:loaders:http')
var EventEmitter = require('events').EventEmitter
var request = require('request')
var async = require('async')
var duration = require('parse-duration')
var merge = require('lodash.merge')
var pick = require('lodash.pick')
var find = require('lodash.find')
var contains = require('lodash.contains')
var format = require('util').format

module.exports = function(_options, postProcessors) {

    var options = merge({}, { mandatory: true, watch: false, request: { json: true, timeout: 10000, gzip: true, forever: false } }, _options)
    var exists = false
    var headers = {}
    var allowedResponseCodes = [200].concat(options.mandatory ? [] : 404)
    var emitter = new EventEmitter()

    return function(confabulous, cb) {
        debug('running')
        setImmediate(function() {
            async.waterfall([validate, watch, load], function(err, result) {
                if (err) return cb(err)
                async.seq.apply(async, postProcessors)(result, cb)
            })
        })
        return emitter

        function validate(cb) {
            debug('validate: %s', JSON.stringify(options))
            if (options.mandatory && !options.url) return cb(new Error('url is required'))
            cb(!options.url)
        }

        function watch(cb) {
            debug('watch: %s, interval:%s', options.url, options.watch.interval)
            if (!options.watch) return cb()
            var watcher = setInterval(function() {
                debug('checking for changes to: %s', options.url)
                head({ headers: { 'If-Modified-Since': headers['last-modified'] } }, function(err, res) {
                    if (!watcher) return
                    if (err) return emitter.emit('error', err)
                    if (!contains(allowedResponseCodes.concat(304), res.statusCode)) return emitter.emit('error', new Error(format('%s returned %d', options.url, res.statusCode)))
                    if (res.statusCode === 304) return
                    if (res.statusCode === 404 && exists || res.statusCode === 200 && (!exists || isModified(res))) emitter.emit('change')
                })
            }, duration(options.watch.interval))
            watcher.unref()
            confabulous.on('reloading', function() {
                clearInterval(watcher)
                watcher = null
            })
            return cb()
        }

        function load(cb) {
            debug('load: %s', options.url)
            exists = false
            get(function(err, res, body) {
                if (err) return cb(err)
                if (!contains(allowedResponseCodes, res.statusCode)) return cb(new Error(format('%s returned %d', options.url, res.statusCode)))
                if (res.statusCode === 404) return cb(true)
                headers = pick(res.headers, 'etag', 'last-modified')
                exists = true
                cb(err, body)
            })
        }

        function head(args, cb) {
            if (arguments.length === 1) return head({}, arguments[0])
            request(merge({ url: options.url, method: 'HEAD'}, options.request, args), cb)
        }

        function get(args, cb) {
            if (arguments.length === 1) return get({}, arguments[0])
            request(merge({ url: options.url, method: 'GET'}, options.request, args), cb)
        }

        function isModified(res) {
            return find(headers, function(value, key) {
                return res.headers[key] !== value
            })
        }
    }
}