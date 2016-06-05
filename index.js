var requireAll = require('require-all')
var path = require('path')

module.exports = {
    Confabulous: require('./lib/Confabulous'),
    loaders: requireAll(path.join(__dirname, './lib/loaders')),
    processors: requireAll(path.join(__dirname, './lib/processors'))
}
