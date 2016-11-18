var merge = require('merge')

module.exports = function() {
    var args = [].slice.call(arguments)
    return merge.recursive.apply(null, [true].concat(args))
}
