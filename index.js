var requireAll = require('require-all')
var path = require('path')

module.exports = {
    Confusion: require('./lib/Confusion'),
    loaders: requireAll(path.join(__dirname, './lib/loaders')),
    transformers: requireAll(path.join(__dirname, './lib/transformers'))
}
