var debug = require('debug')('confabulous:transformers:json')
var parse = require("safe-json-parse/callback")

module.exports = function() {

    return function(text, cb) {
        debug('running')
        parse(text, cb)
    }
}